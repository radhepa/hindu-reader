// Cross-book verse search (Library screen).
// NOTE: "Search across texts" is listed as V2 in DONTS.md — built early on
// the owner's explicit request (2026-06-11).
//
// Multi-word AND substring match over a diacritic-folded haystack of each
// verse's English + transliteration + Sanskrit, so "valmiki" matches
// "Vālmīki" and "krsna" matches "kṛṣṇa". The index is built lazily on the
// first search (never at app launch, per DONTS.md performance rules).

import type { BookId, Verse } from '@/types/scripture';
import { getBook } from './scripture';

const BOOKS: BookId[] = ['gita', 'ramayana', 'mahabharata'];

export const SEARCH_MIN_CHARS = 3;
export const SEARCH_LIMIT = 50;

// NFD + strip combining marks folds IAST diacritics to plain ASCII; Devanagari
// is untouched (its matras are outside U+0300–U+036F), so Sanskrit-script
// queries still work.
const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

interface Entry {
  verse: Verse;
  hay: string;
}

let index: Entry[] | null = null;

function buildIndex(): Entry[] {
  const out: Entry[] = [];
  for (const id of BOOKS) {
    const book = getBook(id);
    for (const v of book.verses) {
      out.push({
        verse: v,
        hay: fold(`${v.translations.english ?? ''}\n${v.transliteration}\n${v.sanskrit}`),
      });
    }
  }
  return out;
}

export function searchVerses(query: string, limit = SEARCH_LIMIT): Verse[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.join('').length < SEARCH_MIN_CHARS) return [];
  if (!index) index = buildIndex();
  const results: Verse[] = [];
  for (const e of index) {
    let ok = true;
    for (const w of words) {
      if (!e.hay.includes(w)) {
        ok = false;
        break;
      }
    }
    if (ok) {
      results.push(e.verse);
      if (results.length >= limit) break;
    }
  }
  return results;
}
