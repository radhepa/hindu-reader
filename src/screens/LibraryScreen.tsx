import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { ChevronRight, Clock, Search, X } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { AnimatedCard } from '@/components/AnimatedCard';
import { TintedIcon } from '@/components/TintedIcon';
import { useTheme } from '@/theme/ThemeProvider';
import { useReaderStore } from '@/store/reader';
import { getBook, getChapters, getVerseById, defaultOpenChapter, verseReferenceLabel } from '@/lib/scripture';
import { countVersesRead } from '@/db/progress';
import { getLastPosition } from '@/db/position';
import { getTotalReadingSeconds } from '@/db/readingTime';
import { searchVerses, SEARCH_LIMIT, SEARCH_MIN_CHARS } from '@/lib/search';
import { formatReadingTime, relativeTime } from '@/lib/format';
import type { BookId, GitaVerse, MahabharataVerse, RamayanaVerse, Verse } from '@/types/scripture';

const BOOKS: BookId[] = ['gita', 'ramayana', 'mahabharata'];

interface CardData {
  bookId: BookId;
  title: string;
  subtitle: string;
  progressPct: number;
  positionLabel: string;
  lastReadLabel: string | null;
  readingTimeLabel: string;
  startChapter: number;
  startVerseId?: string;
  icon: ImageSourcePropType;
}

function topLevelChapterOf(verse: GitaVerse | RamayanaVerse | MahabharataVerse): number {
  switch (verse.book) {
    case 'gita':
      return verse.chapter;
    case 'ramayana':
      return verse.kanda;
    case 'mahabharata':
      return verse.parva;
  }
}

function positionLabelFor(
  bookId: BookId,
  verseId: string | undefined
): { label: string; chapter: number; verseId?: string } {
  if (!verseId) {
    // Open on the chapter that has the most seeded verses so the first-time
    // reader lands on something substantive, not an empty chapter.
    return { label: 'Not started', chapter: defaultOpenChapter(bookId) };
  }
  const v = getVerseById(verseId);
  if (!v) {
    return { label: 'Not started', chapter: defaultOpenChapter(bookId) };
  }
  const ch = topLevelChapterOf(v);
  const book = getBook(bookId);
  const label = v.verse === 0
    ? `${book.meta.structure_label} ${ch} · Invocation`
    : `${book.meta.structure_label} ${ch}, Verse ${v.verse}`;
  return { label, chapter: ch, verseId: v.id };
}

// Deity-illustration icons per text. The require()s are static so Metro
// can bundle the assets ahead of time.
const ICONS: Record<BookId, ImageSourcePropType> = {
  gita: require('../../assets/images/icon-gita.png'),
  ramayana: require('../../assets/images/icon-ramayana.png'),
  mahabharata: require('../../assets/images/icon-mahabharata.png'),
};

// Per-icon focal nudges. The NEW LOGOS source art is already extracted with
// each full silhouette self-centered in its square canvas at a consistent
// fill ratio, so no offset is needed — contain mode centers them parallel.
// Keep the hook in case a single icon needs a small tune later.
const ICON_OFFSETS: Record<BookId, { x?: number; y?: number }> = {
  gita: { y: 0 },
  ramayana: { y: 0 },
  mahabharata: { y: 0 },
};

const BOOK_DESCRIPTIONS: Record<BookId, string> = {
  gita: 'A 700-verse dialogue between Arjuna and Krishna on duty, the self, and devotion — spoken on the battlefield of Kurukshetra.',
  ramayana: 'The epic journey of Rama to rescue his beloved Sita, a timeless story of dharma, devotion, and the triumph of good over evil.',
  mahabharata: 'The world\'s longest epic poem — a sweeping tale of war, kinship, and justice between two branches of the Kuru dynasty.',
};

export function LibraryScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const openBook = useReaderStore((s) => s.openBook);
  const [cards, setCards] = useState<CardData[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verse[]>([]);

  // Debounced cross-book search. The fold/index work happens in lib/search;
  // first search builds the index lazily.
  useEffect(() => {
    const q = query.trim();
    if (q.length < SEARCH_MIN_CHARS) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => setResults(searchVerses(q)), 250);
    return () => clearTimeout(t);
  }, [query]);

  const searching = query.trim().length >= SEARCH_MIN_CHARS;

  const openAndNavigate = (bookId: CardData['bookId'], chapter: number, verseId?: string) => {
    openBook(bookId, chapter, verseId);
    // Defer one frame so the Reader tab has time to register after the
    // store update before we navigate to it.
    requestAnimationFrame(() => navigation.navigate('Reader'));
  };

  async function loadCards() {
    const next: CardData[] = [];
    for (const bookId of BOOKS) {
      const book = getBook(bookId);
      const total = book.meta.total_verses;
      const read = await countVersesRead(bookId);
      const pct = total > 0 ? Math.min(100, (read / total) * 100) : 0;
      const lastPos = await getLastPosition(bookId);
      const pos = positionLabelFor(bookId, lastPos?.verseId);
      const seconds = await getTotalReadingSeconds(bookId);
      next.push({
        bookId,
        title: book.meta.title,
        subtitle: `${book.meta.total_chapters} ${book.meta.structure_label}${book.meta.total_chapters === 1 ? '' : 's'} · ${book.meta.total_verses.toLocaleString()} Verses`,
        progressPct: pct,
        positionLabel: pos.label,
        lastReadLabel: lastPos ? relativeTime(lastPos.updatedAt) : null,
        readingTimeLabel: `${formatReadingTime(seconds)} read`,
        startChapter: pos.chapter,
        startVerseId: pos.verseId,
        icon: ICONS[bookId],
      });
    }
    setCards(next);
  }

  // Refresh when the screen regains focus so progress reflects reading session.
  useFocusEffect(
    React.useCallback(() => {
      loadCards();
    }, [])
  );

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <Screen title="Library">
      {/* Cross-book verse search. */}
      <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.xs }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: theme.colors.bgSecondary,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
          }}
        >
          <Search size={16} strokeWidth={1.5} color={theme.colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search verses in all texts"
            placeholderTextColor={theme.colors.textSecondary}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search verses"
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                fontFamily: theme.fonts.ui,
                fontSize: theme.fontSize.sm,
                color: theme.colors.textPrimary,
              },
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
            ]}
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <X size={16} strokeWidth={1.5} color={theme.colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {searching ? (
          <>
            <Text
              style={{
                fontFamily: theme.fonts.ui,
                fontSize: theme.fontSize.xs,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: theme.spacing.xs,
              }}
            >
              {results.length === 0
                ? 'No matches'
                : results.length >= SEARCH_LIMIT
                  ? `${SEARCH_LIMIT}+ results`
                  : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
            </Text>
            {results.length === 0 ? (
              <Text
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: theme.fontSize.base,
                  color: theme.colors.textSecondary,
                  lineHeight: theme.fontSize.base * 1.5,
                }}
              >
                No verses match "{query.trim()}". Try fewer or different words.
              </Text>
            ) : (
              results.map((v) => (
                <AnimatedCard
                  key={v.id}
                  onPress={() => openAndNavigate(v.book, topLevelChapterOf(v), v.id)}
                  style={{
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    backgroundColor: theme.colors.bgSecondary,
                    padding: theme.spacing.sm,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fonts.ui,
                      fontSize: theme.fontSize.xs,
                      color: theme.colors.accent,
                      marginBottom: 4,
                    }}
                  >
                    {verseReferenceLabel(v)}
                  </Text>
                  <Text
                    numberOfLines={3}
                    style={{
                      fontFamily: theme.fonts.body,
                      fontSize: theme.fontSize.sm,
                      color: theme.colors.textPrimary,
                      lineHeight: theme.fontSize.sm * 1.5,
                    }}
                  >
                    {v.translations.english ?? v.transliteration}
                  </Text>
                </AnimatedCard>
              ))
            )}
          </>
        ) : (
          cards.map((card) => (
          <AnimatedCard
            key={card.bookId}
            onPress={() => openAndNavigate(card.bookId, card.startChapter, card.startVerseId)}
            style={{
              alignSelf: 'stretch',
              borderColor: theme.colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.sm,
              backgroundColor: theme.colors.bgSecondary,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
              }}
            >
              {/* Icon circle. Per LOGO_FIX.md: fixed 64x64, overflow hidden,
                  subtle gold ring, flexShrink:0 so it never gets squeezed by
                  the text block in narrow viewports. */}
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.accentSoft,
                  borderWidth: 1.5,
                  // Accent ring at ~33% opacity — follows the active theme
                  // instead of a fixed gold so it works on Saffron/Minimalist.
                  borderColor: theme.colors.accent + '55',
                  flexShrink: 0,
                }}
              >
                <TintedIcon
                  source={card.icon}
                  size={56}
                  tintColor={theme.colors.textPrimary}
                  offset={ICON_OFFSETS[card.bookId]}
                  accessibilityLabel={`${card.title} icon`}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: theme.fontSize.lg,
                    color: theme.colors.textPrimary,
                  }}
                >
                  {card.title}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.ui,
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {card.subtitle}
                </Text>
              </View>
              <ChevronRight size={18} strokeWidth={1.5} color={theme.colors.textSecondary} />
            </View>

            {/* One-sentence description */}
            <Text
              style={{
                fontFamily: theme.fonts.body,
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                lineHeight: theme.fontSize.sm * 1.55,
                marginBottom: theme.spacing.sm,
              }}
            >
              {BOOK_DESCRIPTIONS[card.bookId]}
            </Text>

            <View
              style={{
                height: 5,
                borderRadius: 3,
                backgroundColor: theme.colors.accentSoft,
                overflow: 'hidden',
                marginBottom: theme.spacing.xs,
              }}
            >
              <View
                style={{
                  width: `${card.progressPct}%`,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: theme.colors.accent,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.ui,
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.textSecondary,
                }}
              >
                {card.positionLabel}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Clock size={11} strokeWidth={1.5} color={theme.colors.textSecondary} />
                <Text
                  style={{
                    fontFamily: theme.fonts.ui,
                    fontSize: theme.fontSize.xs,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {card.readingTimeLabel}
                  {card.lastReadLabel ? ` · ${card.lastReadLabel}` : ''}
                </Text>
              </View>
            </View>
          </AnimatedCard>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
