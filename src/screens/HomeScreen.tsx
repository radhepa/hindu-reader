import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BookOpen, ChevronRight, Flame } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { AnimatedCard } from '@/components/AnimatedCard';
import { GoalRing } from '@/components/GoalRing';
import { useTheme } from '@/theme/ThemeProvider';
import { useSettingsStore } from '@/store/settings';
import { useReaderStore } from '@/store/reader';
import { getBook, getDailyVerseId, getVerseById, resolveTranslation, translationKeyForLanguage, verseShortReference } from '@/lib/scripture';
import { getNextHolidayWithin, daysUntil } from '@/lib/calendar';
import { getCurrentStreak, countVersesReadToday } from '@/db/streak';
import { getLastPosition } from '@/db/position';
import type { BookId } from '@/types/scripture';

interface ContinueEntry {
  bookId: BookId;
  verseId: string;
  chapter: number;
  label: string;
}

function greetingFor(now = new Date()): string {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const HINDU_MONTHS = [
  'Pausha', 'Magha', 'Phalguna', 'Chaitra', 'Vaishakha', 'Jyeshtha',
  'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha',
];

function hinduMonthApprox(now = new Date()): string {
  // Approximate mapping of Gregorian months to nearest Hindu month.
  // Real panchang is lunar — this is a placeholder per CONTENT_STATUS.md.
  return HINDU_MONTHS[now.getMonth()];
}

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const userName = useSettingsStore((s) => s.settings.user_name);
  const language = useSettingsStore((s) => s.settings.language);
  const dailyGoal = useSettingsStore((s) => s.settings.daily_goal);
  const preferredTranslation = translationKeyForLanguage(language);
  const openBook = useReaderStore((s) => s.openBook);

  const [streak, setStreak] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [continueEntry, setContinueEntry] = useState<ContinueEntry | null>(null);

  // Refresh streak, today's count, and last reading position whenever Home
  // regains focus, so a reading session is reflected the moment the user
  // comes back.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const bookIds: BookId[] = ['gita', 'ramayana', 'mahabharata'];
        const [s, n, ...positions] = await Promise.all([
          getCurrentStreak(),
          countVersesReadToday(),
          ...bookIds.map((id) => getLastPosition(id)),
        ]);
        if (cancelled) return;
        setStreak(s as number);
        setTodayCount(n as number);

        // Find the most recently accessed book with a saved verse position.
        type PosResult = { verseId: string; updatedAt: number } | null;
        const entries = (positions as PosResult[])
          .map((pos, i) => {
            if (!pos) return null;
            const v = getVerseById(pos.verseId);
            if (!v) return null;
            const id = bookIds[i];
            const book = getBook(id);
            const ch = v.book === 'gita' ? v.chapter : v.book === 'ramayana' ? v.kanda : v.parva;
            const label =
              v.verse === 0
                ? `${book.meta.structure_label} ${ch} · Invocation`
                : `${book.meta.structure_label} ${ch}, Verse ${v.verse}`;
            return { bookId: id, verseId: pos.verseId, chapter: ch, label, updatedAt: pos.updatedAt };
          })
          .filter(Boolean) as (ContinueEntry & { updatedAt: number })[];

        entries.sort((a, b) => b.updatedAt - a.updatedAt);
        setContinueEntry(entries[0] ? { bookId: entries[0].bookId, verseId: entries[0].verseId, chapter: entries[0].chapter, label: entries[0].label } : null);
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const now = new Date();
  const greeting = greetingFor(now);
  const dateLine = `${now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })} · ${hinduMonthApprox(now)}`;

  const books: BookId[] = ['gita', 'ramayana', 'mahabharata'];
  const upcomingHoliday = getNextHolidayWithin(7, now);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing.xl }}>
        <Text
          style={{
            fontFamily: theme.fonts.display,
            fontSize: theme.fontSize.xxl,
            color: theme.colors.textPrimary,
            marginBottom: 6,
          }}
        >
          {greeting}{userName ? `, ${userName}` : ''}
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.ui,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
          }}
        >
          {dateLine}
        </Text>

        {/* Streak badge inside the daily goal ring — prominent, centered. */}
        <View style={{ alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <GoalRing progress={dailyGoal > 0 ? todayCount / dailyGoal : 0}>
            <Flame
              color={theme.colors.accent}
              fill={streak > 0 ? theme.colors.accent : 'transparent'}
              size={22}
              strokeWidth={1.5}
            />
            <Text
              style={{
                fontFamily: theme.fonts.display,
                fontSize: theme.fontSize.xl,
                color: theme.colors.textPrimary,
                marginTop: 2,
              }}
            >
              {streak}
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.ui,
                fontSize: theme.fontSize.xs,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              day streak
            </Text>
          </GoalRing>
          <Text
            style={{
              fontFamily: theme.fonts.ui,
              fontSize: theme.fontSize.sm,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.xs,
            }}
          >
            {todayCount >= dailyGoal
              ? `Goal met · ${todayCount} verses today`
              : `${todayCount} of ${dailyGoal} verses today`}
          </Text>
        </View>

        {/* Continue Reading shortcut — shown once a book has a saved position. */}
        {continueEntry ? (
          <AnimatedCard
            onPress={() => {
              openBook(continueEntry.bookId, continueEntry.chapter, continueEntry.verseId);
              requestAnimationFrame(() => navigation.navigate('Reader'));
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.sm,
              backgroundColor: theme.colors.accentSoft,
              borderColor: theme.colors.accent + '44',
              borderWidth: 1,
              borderRadius: 16,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              marginBottom: theme.spacing.md,
            }}
          >
            <BookOpen size={20} strokeWidth={1.5} color={theme.colors.accent} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: theme.fonts.ui,
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.accent,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Continue Reading
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: theme.fontSize.sm,
                  color: theme.colors.textPrimary,
                  marginTop: 2,
                }}
              >
                {getBook(continueEntry.bookId).meta.title} · {continueEntry.label}
              </Text>
            </View>
            <ChevronRight size={16} strokeWidth={1.5} color={theme.colors.accent} />
          </AnimatedCard>
        ) : null}

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
          Today's verses
        </Text>

        {books.map((bookId) => {
          const verseId = getDailyVerseId(bookId, now);
          const verse = verseId ? getVerseById(verseId) : null;
          if (!verse) return null;
          const book = getBook(bookId);
          const trans = resolveTranslation(verse, preferredTranslation);
          return (
            <AnimatedCard
              key={bookId}
              onPress={() => {
                openBook(
                  bookId,
                  verse.book === 'gita'
                    ? verse.chapter
                    : verse.book === 'ramayana'
                      ? verse.kanda
                      : verse.parva,
                  verse.id
                );
                requestAnimationFrame(() => navigation.navigate('Reader'));
              }}
              style={{
                backgroundColor: theme.colors.bgSecondary,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: 16,
                padding: theme.spacing.md,
                marginBottom: theme.spacing.sm,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.colors.accentSoft,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fonts.ui,
                      fontSize: theme.fontSize.xs,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {book.meta.title}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: theme.fonts.ui,
                    fontSize: theme.fontSize.xs,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {verseShortReference(verse)}
                </Text>
              </View>
              <Text
                numberOfLines={3}
                style={{
                  fontFamily: theme.fonts.devanagari,
                  fontSize: theme.fontSize.md,
                  color: theme.colors.textPrimary,
                  lineHeight: theme.fontSize.md * 1.9,
                  marginBottom: 10,
                }}
              >
                {verse.sanskrit}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: theme.fontSize.base,
                  color: theme.colors.textPrimary,
                  lineHeight: theme.fontSize.base * 1.6,
                  marginBottom: 12,
                }}
              >
                {trans?.text ?? '—'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.ui,
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.accent,
                  }}
                >
                  Read in context
                </Text>
                <ChevronRight size={15} strokeWidth={2} color={theme.colors.accent} />
              </View>
            </AnimatedCard>
          );
        })}

        {upcomingHoliday ? (
          <View
            style={{
              marginTop: theme.spacing.md,
              borderRadius: 16,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.accentSoft,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.ui,
                fontSize: theme.fontSize.xs,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              Upcoming · in {daysUntil(upcomingHoliday.date, now)} days
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.display,
                fontSize: theme.fontSize.lg,
                color: theme.colors.textPrimary,
              }}
            >
              {upcomingHoliday.name}
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.body,
                fontSize: theme.fontSize.base,
                color: theme.colors.textPrimary,
                lineHeight: theme.fontSize.base * 1.5,
                marginTop: 4,
              }}
            >
              {upcomingHoliday.description_en}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
