// Scripture data access layer.
// Per DONTS.md: do not parse all three book JSONs at startup, do not store
// verse text in component state. This module owns the loading + caching;
// callers receive plain typed objects.

import type {
  BookFile,
  BookId,
  ChapterIndex,
  GitaVerse,
  MahabharataVerse,
  RamayanaVerse,
  TranslationKey,
  UiLang,
  Verse,
} from '@/types/scripture';

const cache = new Map<BookId, BookFile>();

function loadBook(bookId: BookId): BookFile {
  const cached = cache.get(bookId);
  if (cached) return cached;
  let mod: BookFile;
  switch (bookId) {
    case 'gita':
      mod = require('../../assets/data/gita.json') as BookFile;
      break;
    case 'ramayana':
      mod = require('../../assets/data/ramayana.json') as BookFile;
      break;
    case 'mahabharata':
      mod = require('../../assets/data/mahabharata.json') as BookFile;
      break;
  }
  cache.set(bookId, mod);
  return mod;
}

export function getBook(bookId: BookId): BookFile {
  return loadBook(bookId);
}

export function getChapters(bookId: BookId): ChapterIndex[] {
  return loadBook(bookId).chapters;
}

export function getChapter(bookId: BookId, chapterNumber: number): ChapterIndex | null {
  return loadBook(bookId).chapters.find((c) => c.number === chapterNumber) ?? null;
}

// Returns verses for a given top-level chapter/kanda/parva.
// For Gita: chapter. For Ramayana: kanda. For Mahabharata: parva.
export function getVersesInChapter(bookId: BookId, chapterNumber: number): Verse[] {
  const book = loadBook(bookId);
  switch (bookId) {
    case 'gita':
      return (book.verses as GitaVerse[]).filter((v) => v.chapter === chapterNumber);
    case 'ramayana':
      return (book.verses as RamayanaVerse[]).filter((v) => v.kanda === chapterNumber);
    case 'mahabharata':
      return (book.verses as MahabharataVerse[]).filter((v) => v.parva === chapterNumber);
  }
}

export function getVerseById(verseId: string): Verse | null {
  // Parse the book prefix from the id.
  let bookId: BookId;
  if (verseId.startsWith('gita_')) bookId = 'gita';
  else if (verseId.startsWith('ramayana_')) bookId = 'ramayana';
  else if (verseId.startsWith('mbh_')) bookId = 'mahabharata';
  else return null;
  const book = loadBook(bookId);
  return book.verses.find((v) => v.id === verseId) ?? null;
}

// Daily quote selection per DATA.md §6 — deterministic, date-based.
// All users see the same verse for the same calendar day.
export function getDailyVerseId(bookId: BookId, date: Date = new Date()): string | null {
  const book = loadBook(bookId);
  const pool = book.verses.filter((v) => v.daily_quote_eligible).map((v) => v.id);
  if (pool.length === 0) return null;
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % pool.length;
  return pool[index];
}

// Translation resolution — given a user's preferred translation/language,
// returns the best available string for this verse.
// Sanskrit and Transliteration are stored as top-level verse fields (not in
// `translations`) since they're rendered above the divider too — but the
// switcher allows users to view either-only by picking that pill.
// Falls back gracefully: preferred -> english -> any other translation.
export function resolveTranslation(
  verse: Verse,
  preferred: TranslationKey
): { text: string; key: TranslationKey } | null {
  if (preferred === 'sanskrit') {
    return { text: verse.sanskrit, key: 'sanskrit' };
  }
  if (preferred === 'transliteration') {
    return { text: verse.transliteration, key: 'transliteration' };
  }
  const direct = verse.translations[preferred];
  if (direct) return { text: direct, key: preferred };
  const fallback = verse.translations.english;
  if (fallback) return { text: fallback, key: 'english' };
  // Last resort: any present translation.
  for (const [k, v] of Object.entries(verse.translations)) {
    if (v) return { text: v, key: k as TranslationKey };
  }
  return null;
}

export function resolveExplanation(
  verse: Verse,
  preferred: UiLang
): { text: string; lang: UiLang } | null {
  const direct = verse.explanations[preferred];
  if (direct) return { text: direct, lang: preferred };
  const fallback = verse.explanations.en;
  if (fallback) return { text: fallback, lang: 'en' };
  return null;
}

// Reference label e.g. "Bhagavad Gita · Chapter 2, Verse 47".
export function verseReferenceLabel(verse: Verse): string {
  switch (verse.book) {
    case 'gita':
      return `Bhagavad Gita · Chapter ${verse.chapter}, Verse ${verse.verse}`;
    case 'ramayana':
      return `Ramayana · ${verse.kanda_name}, Sarga ${verse.sarga}, Verse ${verse.verse}`;
    case 'mahabharata':
      return `Mahabharata · ${verse.parva_name}, Chapter ${verse.chapter}, Verse ${verse.verse}`;
  }
}

// Reference without the book name — for contexts (Home daily-quote cards)
// where the book is already named in an adjacent pill.
export function verseShortReference(verse: Verse): string {
  switch (verse.book) {
    case 'gita':
      return `Chapter ${verse.chapter}, Verse ${verse.verse}`;
    case 'ramayana':
      return `${verse.kanda_name} ${verse.sarga}.${verse.verse}`;
    case 'mahabharata':
      return verse.verse === 0
        ? `${verse.parva_name} · Invocation`
        : `${verse.parva_name} ${verse.chapter}.${verse.verse}`;
  }
}

// Maps the user's UI language to the TranslationKey used to look up the
// verse-translation text. Sanskrit and Transliteration are always rendered
// above the translation block separately, so they're not part of this map.
export function translationKeyForLanguage(lang: UiLang): TranslationKey {
  switch (lang) {
    case 'en': return 'english';
    case 'hi': return 'hi';
    case 'gu': return 'gu';
    case 'ta': return 'ta';
  }
}

// Returns the set of TranslationKeys that have data across the given verses.
// Sanskrit + Transliteration are always available since they're top-level
// fields. english + others appear only if at least one verse provides
// that key in its `translations` map.
export function availableTranslationKeys(verses: Verse[]): Set<TranslationKey> {
  const keys = new Set<TranslationKey>(['sanskrit', 'transliteration']);
  for (const v of verses) {
    for (const k of Object.keys(v.translations) as TranslationKey[]) {
      const value = v.translations[k];
      if (typeof value === 'string' && value.length > 0) keys.add(k);
    }
  }
  return keys;
}

// Top-level chapter numbers (chapter/kanda/parva) that have at least one
// bundled verse. Used by Library to land readers in seeded content rather
// than an empty chapter.
export function chaptersWithVerses(bookId: BookId): number[] {
  const book = loadBook(bookId);
  const seen = new Set<number>();
  for (const v of book.verses) {
    switch (v.book) {
      case 'gita':
        seen.add((v as GitaVerse).chapter);
        break;
      case 'ramayana':
        seen.add((v as RamayanaVerse).kanda);
        break;
      case 'mahabharata':
        seen.add((v as MahabharataVerse).parva);
        break;
    }
  }
  return Array.from(seen).sort((a, b) => a - b);
}

// Returns the FIRST chapter that has bundled verses, or chapter 1 as fallback.
// Good "default open" when there's no last-read position — a new reader
// starts at the beginning of the text, skipping any unfilled leading chapters.
export function defaultOpenChapter(bookId: BookId): number {
  const book = loadBook(bookId);
  let first = Number.POSITIVE_INFINITY;
  for (const v of book.verses) {
    let ch: number;
    switch (v.book) {
      case 'gita': ch = (v as GitaVerse).chapter; break;
      case 'ramayana': ch = (v as RamayanaVerse).kanda; break;
      case 'mahabharata': ch = (v as MahabharataVerse).parva; break;
    }
    if (ch < first) first = ch;
  }
  return Number.isFinite(first) ? first : 1;
}

// Short reference for compact pills, e.g. "BG 2.47".
export function verseShortLabel(verse: Verse): string {
  switch (verse.book) {
    case 'gita':
      return `BG ${verse.chapter}.${verse.verse}`;
    case 'ramayana':
      return `Ramayana ${verse.kanda}.${verse.sarga}.${verse.verse}`;
    case 'mahabharata':
      return `MBh ${verse.parva}.${verse.chapter}.${verse.verse}`;
  }
}
