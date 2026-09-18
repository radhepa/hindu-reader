import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ArrowLeft, CaseSensitive, List as IconList } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useReaderStore } from '@/store/reader';
import { useSettingsStore } from '@/store/settings';
import {
  chaptersWithVerses,
  getBook,
  getChapter,
  getVersesInChapter,
  resolveTranslation,
  translationKeyForLanguage,
} from '@/lib/scripture';
import { VerseBlock } from '@/components/VerseBlock';
import { ExplainDrawer } from '@/components/ExplainDrawer';
import { ChapterSelector } from '@/components/ChapterSelector';
import { markVerseRead, getReadVerseIds } from '@/db/progress';
import { updateTodayStreak } from '@/db/streak';
import { addReadingSeconds } from '@/db/readingTime';
import { setLastPosition } from '@/db/position';
import { getBookmarkedVerseIds, toggleBookmark } from '@/db/bookmarks';
import type { Verse, BookId } from '@/types/scripture';

// Full kandas run to ~3,700 verses — far too many blocks to mount at once.
// The reader stays a single continuous scroll (no pagination per DONTS.md);
// we just mount verse blocks incrementally as the user approaches the bottom.
const INITIAL_RENDER = 80;
const RENDER_BATCH = 150;
const EXTEND_THRESHOLD_PX = 2400;

export function ReaderScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const activeBookId = useReaderStore((s) => s.activeBookId);
  const activeChapter = useReaderStore((s) => s.activeChapter);
  const pendingScrollVerseId = useReaderStore((s) => s.pendingScrollVerseId);
  const setChapter = useReaderStore((s) => s.setChapter);
  const setPendingScroll = useReaderStore((s) => s.setPendingScroll);
  const closeBook = useReaderStore((s) => s.closeBook);

  const language = useSettingsStore((s) => s.settings.language);
  // Single source of truth: language drives translation. Sanskrit and Roman
  // (transliteration) are always shown above the translation in VerseBlock.
  const translationKey = translationKeyForLanguage(language);

  const [chapterSelectorOpen, setChapterSelectorOpen] = useState(false);
  const [explainVerse, setExplainVerse] = useState<Verse | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [explained, setExplained] = useState<Set<string>>(new Set());
  const [renderLimit, setRenderLimit] = useState(INITIAL_RENDER);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const enterOpacity = useRef(new Animated.Value(0)).current;
  const enterSlide = useRef(new Animated.Value(22)).current;
  // Verse counter shown in the header — updated only when the visible verse changes.
  const [headerVerseNum, setHeaderVerseNum] = useState(1);
  // Font scale cycles: normal → large → small → normal.
  const FONT_SCALES = [1.0, 1.2, 0.85] as const;
  const [fontScaleIdx, setFontScaleIdx] = useState(0);
  const fontScale = FONT_SCALES[fontScaleIdx];

  const scrollRef = useRef<ScrollView>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verseOffsets = useRef<Map<string, number>>(new Map());
  const readIds = useRef<Set<string>>(new Set());
  // Track scroll position so we only mark verses the user actually scrolls past.
  const scrollY = useRef(0);
  const layoutH = useRef(600);
  // The verse closest to the top of the visible area — updated synchronously on
  // every scroll event and flushed to the DB debounced / on blur.
  const currentVerseIdRef = useRef<string | null>(null);
  const savePositionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(enterOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(enterSlide, {
          toValue: 0,
          speed: 18,
          bounciness: 4,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
      return () => {
        enterOpacity.setValue(0);
        enterSlide.setValue(22);
      };
    }, [])
  );

  // Per-book reading-time tracker: accrue seconds against the open book while
  // the Reader is focused. 30s heartbeat plus a flush of the remainder on
  // blur/book-change, so an abrupt exit loses at most 30 seconds.
  useFocusEffect(
    useCallback(() => {
      if (!activeBookId) return;
      const book = activeBookId;
      let lastFlush = Date.now();
      const heartbeat = setInterval(() => {
        addReadingSeconds(book, (Date.now() - lastFlush) / 1000);
        lastFlush = Date.now();
      }, 30000);
      return () => {
        clearInterval(heartbeat);
        addReadingSeconds(book, (Date.now() - lastFlush) / 1000);
        // Flush the current scroll position immediately on blur so navigating
        // away via any tab or the back button always saves the right place.
        if (savePositionTimerRef.current) clearTimeout(savePositionTimerRef.current);
        if (currentVerseIdRef.current) setLastPosition(book, currentVerseIdRef.current);
      };
    }, [activeBookId])
  );

  // All hooks must run unconditionally — the early return is at the bottom,
  // after every hook. Null-safe fallbacks keep hooks stable when no book is open.
  const book = useMemo(
    () => (activeBookId ? getBook(activeBookId) : null),
    [activeBookId]
  );
  const chapter = useMemo(
    () => (activeBookId && activeChapter != null ? getChapter(activeBookId, activeChapter) : null),
    [activeBookId, activeChapter]
  );
  const verses = useMemo(
    () => (activeBookId && activeChapter != null ? getVersesInChapter(activeBookId, activeChapter) : ([] as ReturnType<typeof getVersesInChapter>)),
    [activeBookId, activeChapter]
  );
  const seededChapters = useMemo(
    () => (activeBookId ? chaptersWithVerses(activeBookId) : []),
    [activeBookId]
  );

  // Reset the render window and scroll position when the chapter changes.
  useEffect(() => {
    if (!activeBookId || activeChapter == null) return;
    if (currentVerseIdRef.current) {
      if (savePositionTimerRef.current) clearTimeout(savePositionTimerRef.current);
      setLastPosition(activeBookId, currentVerseIdRef.current);
    }
    currentVerseIdRef.current = null;
    verseOffsets.current.clear();
    setRenderLimit(INITIAL_RENDER);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeBookId, activeChapter]);

  // Grow the window to cover a pending scroll target (daily quote / last read)
  // so the target verse is actually mounted and measurable.
  useEffect(() => {
    if (!pendingScrollVerseId) return;
    const idx = verses.findIndex((v) => v.id === pendingScrollVerseId);
    if (idx >= 0) setRenderLimit((c) => Math.max(c, idx + 40));
  }, [pendingScrollVerseId, verses]);

  // Hydrate bookmark + read state when book/chapter changes.
  useEffect(() => {
    if (!activeBookId || activeChapter == null) return;
    (async () => {
      const bm = await getBookmarkedVerseIds(activeBookId);
      setBookmarked(bm);
      const rd = await getReadVerseIds(activeBookId);
      readIds.current = rd;
      setExplained((prev) => {
        const next = new Set(prev);
        for (const v of verses) if (rd.has(v.id)) next.add(v.id);
        return next;
      });
      // Seed current position with the first verse of this chapter so a
      // tab-switch immediately after chapter open always saves something useful.
      if (verses[0]) {
        currentVerseIdRef.current = verses[0].id;
        setLastPosition(verses[0].book, verses[0].id);
      }
    })();
  }, [activeBookId, activeChapter, verses]);

  // Mark only the verses the user has actually scrolled past as read.
  // Called on every scroll event and once after mount so the initial
  // viewport is counted without requiring a scroll gesture.
  const markScrolledVerses = useCallback(() => {
    const visibleBottom = scrollY.current + layoutH.current;
    if (visibleBottom <= 0) return;
    const toMark: Verse[] = [];
    for (const v of verses.slice(0, renderLimit)) {
      if (readIds.current.has(v.id)) continue;
      const y = verseOffsets.current.get(v.id);
      if (y !== undefined && y < visibleBottom) {
        readIds.current.add(v.id);
        toMark.push(v);
      }
    }
    if (toMark.length === 0) return;
    Promise.all(toMark.map((v) => markVerseRead(v.book, v.id))).then(() => {
      updateTodayStreak(useSettingsStore.getState().settings.daily_goal);
    });
  }, [verses, renderLimit]);

  // Run after layouts settle on chapter open and after render window extends.
  useEffect(() => {
    const t = setTimeout(markScrolledVerses, 400);
    return () => clearTimeout(t);
  }, [markScrolledVerses]);

  // Identify the topmost verse currently in the visible area.
  // Called synchronously from onScroll — no DB writes here.
  const updateCurrentVerse = useCallback(() => {
    const topEdge = scrollY.current + 80;
    let bestId: string | null = null;
    let bestY = -Infinity;
    for (const v of verses) {
      const y = verseOffsets.current.get(v.id);
      if (y !== undefined && y <= topEdge && y > bestY) {
        bestY = y;
        bestId = v.id;
      }
    }
    if (bestId && bestId !== currentVerseIdRef.current) {
      currentVerseIdRef.current = bestId;
      const idx = verses.findIndex((v) => v.id === bestId);
      if (idx >= 0) setHeaderVerseNum(idx + 1);
    }
  }, [verses]);

  // Scroll to a specific verse when the screen mounts with a pending target.
  // Offsets appear as blocks lay out, so poll briefly until the target is
  // measured (large windows can take a few frames).
  useEffect(() => {
    if (!pendingScrollVerseId || verses.length === 0) return;
    let tries = 0;
    let t: ReturnType<typeof setTimeout>;
    const attempt = () => {
      const y = verseOffsets.current.get(pendingScrollVerseId);
      if (typeof y === 'number') {
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: false });
        setPendingScroll(null);
      } else if (++tries < 25) {
        t = setTimeout(attempt, 100);
      } else {
        setPendingScroll(null); // target not in this chapter — give up quietly
      }
    };
    t = setTimeout(attempt, 60);
    return () => clearTimeout(t);
  }, [pendingScrollVerseId, verses]);

  // Extend the render window as the user nears the bottom, mark verses that
  // have scrolled into view as read, and track the reading position.
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      scrollY.current = contentOffset.y;
      layoutH.current = layoutMeasurement.height;
      if (contentOffset.y + layoutMeasurement.height > contentSize.height - EXTEND_THRESHOLD_PX) {
        setRenderLimit((c) => Math.min(c + RENDER_BATCH, verses.length));
      }
      markScrolledVerses();
      updateCurrentVerse();
      // Debounced DB write — fires 1.5 s after the last scroll event.
      if (savePositionTimerRef.current) clearTimeout(savePositionTimerRef.current);
      savePositionTimerRef.current = setTimeout(() => {
        if (currentVerseIdRef.current && activeBookId) setLastPosition(activeBookId, currentVerseIdRef.current);
      }, 1500);
    },
    [verses.length, markScrolledVerses, updateCurrentVerse, activeBookId]
  );

  const onPressExplain = useCallback((verse: Verse) => {
    setExplainVerse(verse);
    setExplained((prev) => {
      const next = new Set(prev);
      next.add(verse.id);
      return next;
    });
    markVerseRead(verse.book, verse.id);
    setLastPosition(verse.book, verse.id);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastOpacity.stopAnimation();
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => setToastMsg(null));
    }, 1400);
  }, [toastOpacity]);

  const onToggleBookmark = useCallback(async (verse: Verse) => {
    const nowBookmarked = await toggleBookmark(verse.book, verse.id);
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (nowBookmarked) next.add(verse.id);
      else next.delete(verse.id);
      return next;
    });
    showToast(nowBookmarked ? 'Verse bookmarked' : 'Bookmark removed');
  }, [showToast]);

  // All hooks have run. Safe to bail out early now.
  if (!activeBookId || activeChapter == null || !book || !chapter) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bgPrimary }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text
            style={{
              fontFamily: theme.fonts.body,
              fontSize: theme.fontSize.base,
              color: theme.colors.textSecondary,
              textAlign: 'left',
            }}
          >
            No text is open. Pick one from the Library.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const bookId: BookId = activeBookId;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bgPrimary }} edges={['top']}>
      <Animated.View
        style={[
          { flex: 1, opacity: enterOpacity },
          Platform.OS !== 'web' ? { transform: [{ translateY: enterSlide }] } : null,
        ]}
      >
      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.md,
          paddingTop: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        <Pressable
          onPress={() => {
            closeBook();
            navigation.navigate('Library');
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back to Library"
        >
          <ArrowLeft size={22} strokeWidth={1.5} color={theme.colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: theme.fonts.ui,
              fontSize: theme.fontSize.xs,
              color: theme.colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {book.meta.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: theme.fonts.display,
              fontSize: theme.fontSize.base,
              color: theme.colors.textPrimary,
            }}
          >
            {chapter ? `${book.meta.structure_label} ${chapter.number} · ${chapter.name}` : ''}
          </Text>
          {verses.length > 0 ? (
            <Text
              style={{
                fontFamily: theme.fonts.ui,
                fontSize: 10,
                color: theme.colors.textSecondary,
                marginTop: 1,
              }}
            >
              {headerVerseNum} of {verses.length}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Pressable
            onPress={() => setFontScaleIdx((i) => (i + 1) % FONT_SCALES.length)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Change font size"
          >
            <CaseSensitive size={20} strokeWidth={1.5} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable
            onPress={() => setChapterSelectorOpen(true)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Choose chapter"
          >
            <IconList size={22} strokeWidth={1.5} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* Verse list — continuous scroll, no pagination. */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.md,
          paddingBottom: theme.spacing.xl,
        }}
        showsVerticalScrollIndicator={true}
        onScroll={onScroll}
        scrollEventThrottle={32}
        onLayout={(e) => { layoutH.current = e.nativeEvent.layout.height; }}
      >
        {chapter ? (
          <View style={{ alignItems: 'center', paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xs }}>
            <Text
              style={{
                fontFamily: theme.fonts.display,
                fontSize: theme.fontSize.lg,
                color: theme.colors.textPrimary,
                textAlign: 'center',
              }}
            >
              {chapter.name}
            </Text>
            <View
              style={{
                height: 1,
                width: 60,
                marginTop: theme.spacing.xs,
                backgroundColor: theme.colors.accent,
                opacity: 0.5,
              }}
            />
          </View>
        ) : null}

        {verses.length === 0 ? (
          <View style={{ padding: theme.spacing.md }}>
            <Text
              style={{
                fontFamily: theme.fonts.body,
                fontSize: theme.fontSize.base,
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.xs,
              }}
            >
              No verses bundled for {book.meta.structure_label.toLowerCase()} {activeChapter} yet.
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.ui,
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.md,
              }}
            >
              Jump to a {book.meta.structure_label.toLowerCase()} that has content:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {seededChapters.map((n) => {
                const ch = getChapter(bookId, n);
                return (
                  <Pressable
                    key={n}
                    onPress={() => setChapter(n)}
                    accessibilityRole="button"
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.bgSecondary,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.ui,
                        fontSize: theme.fontSize.xs,
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {book.meta.structure_label} {n}
                    </Text>
                    <Text
                      style={{
                        fontFamily: theme.fonts.body,
                        fontSize: theme.fontSize.sm,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      {ch?.name ?? ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : (
          verses.slice(0, renderLimit).map((item, idx) => {
            const trans = resolveTranslation(item, translationKey);
            // Sub-structure divider: Ramayana divides kandas into sargas,
            // Mahabharata divides parvas into adhyayas (the `chapter` field).
            // The Gita has no sub-structure and keeps thin inter-verse rules.
            const subUnitOf = (v: Verse): number | undefined =>
              v.book === 'ramayana' ? v.sarga : v.book === 'mahabharata' ? v.chapter : undefined;
            const sarga = subUnitOf(item);
            const prevSarga = idx > 0 ? subUnitOf(verses[idx - 1]) : undefined;
            const sargaName =
              'sarga_name' in item && (item as any).sarga_name ? (item as any).sarga_name : undefined;
            const showSargaDivider = sarga != null && sarga !== prevSarga;
            return (
              <View
                key={item.id}
                onLayout={(e) => {
                  verseOffsets.current.set(item.id, e.nativeEvent.layout.y);
                }}
              >
                {showSargaDivider ? (
                  <View
                    style={{
                      alignItems: 'center',
                      paddingTop: idx === 0 ? theme.spacing.sm : theme.spacing.lg,
                      paddingBottom: theme.spacing.sm,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.ui,
                        fontSize: theme.fontSize.xs,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {book.meta.sub_structure_unit ?? 'Sarga'} {sarga}
                    </Text>
                    {sargaName ? (
                      <Text
                        style={{
                          fontFamily: theme.fonts.display,
                          fontSize: theme.fontSize.lg,
                          color: theme.colors.textPrimary,
                          textAlign: 'center',
                          marginTop: 2,
                        }}
                      >
                        {sargaName}
                      </Text>
                    ) : null}
                    <View
                      style={{
                        height: 1,
                        width: 60,
                        marginTop: theme.spacing.xs,
                        backgroundColor: theme.colors.accent,
                        opacity: 0.5,
                      }}
                    />
                  </View>
                ) : idx > 0 ? (
                  <View style={{ height: 1, backgroundColor: theme.colors.border, opacity: 0.3 }} />
                ) : null}
                <VerseBlock
                  verse={item}
                  translationKey={trans?.key ?? translationKey}
                  translationText={trans?.text ?? null}
                  bookmarked={bookmarked.has(item.id)}
                  explained={explained.has(item.id)}
                  fontScale={fontScale}
                  onPressExplain={() => onPressExplain(item)}
                  onToggleBookmark={() => onToggleBookmark(item)}
                />
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Chapter selector modal */}
      <ChapterSelector
        bookId={bookId}
        visible={chapterSelectorOpen}
        activeChapter={activeChapter}
        onSelect={(c) => {
          setChapterSelectorOpen(false);
          setChapter(c);
        }}
        onClose={() => setChapterSelectorOpen(false)}
      />

      {/* Explain drawer — bottom drawer, preserves underlying scroll position. */}
      <ExplainDrawer
        verse={explainVerse}
        visible={!!explainVerse}
        onClose={() => setExplainVerse(null)}
      />

      {/* Bookmark toast — always mounted; opacity animates in/out */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: toastOpacity,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.textPrimary,
            paddingHorizontal: 18,
            paddingVertical: 9,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.ui,
              fontSize: theme.fontSize.sm,
              color: theme.colors.bgPrimary,
            }}
          >
            {toastMsg ?? ''}
          </Text>
        </View>
      </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}
