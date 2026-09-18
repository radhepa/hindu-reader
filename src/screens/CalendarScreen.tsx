import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme/ThemeProvider';
import { getUpcomingHolidays, daysUntil } from '@/lib/calendar';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function formatHolidayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

export function CalendarScreen() {
  const theme = useTheme();
  const upcoming = getUpcomingHolidays(20);

  return (
    <Screen title="Calendar">
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing.xl }}>
        {upcoming.length === 0 ? (
          <Text
            style={{
              fontFamily: theme.fonts.body,
              fontSize: theme.fontSize.base,
              color: theme.colors.textSecondary,
              textAlign: 'left',
            }}
          >
            No upcoming holidays in the current dataset.
          </Text>
        ) : (
          upcoming.map((h) => (
            <View
              key={h.id}
              style={{
                paddingVertical: theme.spacing.sm,
                borderBottomColor: theme.colors.border,
                borderBottomWidth: 1,
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
                {formatHolidayDate(h.date)} · in {daysUntil(h.date)} {daysUntil(h.date) === 1 ? 'day' : 'days'}
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: theme.fontSize.lg,
                  color: theme.colors.textPrimary,
                }}
              >
                {h.name}
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: theme.fontSize.base,
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {h.description_en}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
