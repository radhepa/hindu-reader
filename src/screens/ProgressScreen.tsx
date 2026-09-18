import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Clock, Flame } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme/ThemeProvider';
import { getCurrentStreak, getWeeklyConsistency } from '@/db/streak';
import { countVersesRead } from '@/db/progress';
import { getTotalReadingSeconds } from '@/db/readingTime';
import { formatReadingTime } from '@/lib/format';
import { getBook } from '@/lib/scripture';
import type { BookId } from '@/types/scripture';

const BOOKS: BookId[] = ['gita', 'ramayana', 'mahabharata'];

const ZERO: Record<BookId, number> = { gita: 0, ramayana: 0, mahabharata: 0 };

export function ProgressScreen() {
  const theme = useTheme();
  const [streak, setStreak] = useState(0);
  const [week, setWeek] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [counts, setCounts] = useState<Record<BookId, number>>(ZERO);
  const [seconds, setSeconds] = useState<Record<BookId, number>>(ZERO);

  // Refresh on focus so a just-finished reading session is reflected.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [s, w] = await Promise.all([getCurrentStreak(), getWeeklyConsistency()]);
        const nextCounts = { ...ZERO };
        const nextSeconds = { ...ZERO };
        for (const b of BOOKS) {
          nextCounts[b] = await countVersesRead(b);
          nextSeconds[b] = await getTotalReadingSeconds(b);
        }
        if (!cancelled) {
          setStreak(s);
          setWeek(w);
          setCounts(nextCounts);
          setSeconds(nextSeconds);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <Screen title="Progress">
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing.xl }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: theme.spacing.md,
          }}
        >
          <Flame color={theme.colors.accent} size={36} strokeWidth={1.5} />
          <Text
            style={{
              fontFamily: theme.fonts.display,
              fontSize: theme.fontSize.xl,
              color: theme.colors.textPrimary,
            }}
          >
            {streak} day streak
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            marginBottom: theme.spacing.lg,
          }}
        >
          {week.map((hit, i) => (
            <View
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                backgroundColor: hit ? theme.colors.accent : theme.colors.accentSoft,
              }}
            />
          ))}
        </View>

        <Text
          style={{
            fontFamily: theme.fonts.ui,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.sm,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Per book
        </Text>
        {BOOKS.map((b) => {
          const book = getBook(b);
          const total = book.meta.total_verses;
          const read = counts[b];
          const pct = total > 0 ? Math.round((read / total) * 100) : 0;
          return (
            <View
              key={b}
              style={{
                paddingVertical: theme.spacing.sm,
                borderBottomColor: theme.colors.border,
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: theme.fontSize.base,
                    color: theme.colors.textPrimary,
                  }}
                >
                  {book.meta.title}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.ui,
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {read} of {total} ({pct}%)
                </Text>
              </View>
              <View
                style={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.colors.accentSoft,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${pct}%`,
                    height: 4,
                    backgroundColor: theme.colors.accent,
                  }}
                />
              </View>
              {/* Per-book reading-time tracker */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <Clock size={12} strokeWidth={1.5} color={theme.colors.textSecondary} />
                <Text
                  style={{
                    fontFamily: theme.fonts.ui,
                    fontSize: theme.fontSize.xs,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {formatReadingTime(seconds[b])} read
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
