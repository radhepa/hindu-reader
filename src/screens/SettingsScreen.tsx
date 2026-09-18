import React, { type ReactNode } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme/ThemeProvider';
import { THEMES } from '@/theme/tokens';
import { useSettingsStore } from '@/store/settings';
import { saveSetting } from '@/db/settings';
import type { ThemeId, FontSize } from '@/types/settings';
import type { UiLang } from '@/types/scripture';

// Single Language setting: drives BOTH the translation shown in the Reader
// and the explanation language. Sanskrit + Roman are always shown above the
// translation in the verse block, so they aren't user-pickable.
const LANGUAGES: { key: UiLang; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'hi', label: 'Hindi' },
];

const LANGUAGES_COMING_SOON = ['Gujarati', 'Tamil', 'Spanish'];

// Preview sizes are fixed (not theme-scaled) so the three options always
// show their relative difference, whatever size is currently active.
const FONT_SIZES: { key: FontSize; label: string; preview: number }[] = [
  { key: 'small', label: 'Small', preview: 15 },
  { key: 'medium', label: 'Medium', preview: 19 },
  { key: 'large', label: 'Large', preview: 24 },
];

const DAILY_GOALS = [5, 10, 20, 50];

export function SettingsScreen() {
  const theme = useTheme();
  const settings = useSettingsStore((s) => s.settings);
  const patch = useSettingsStore((s) => s.patch);

  async function update<K extends keyof typeof settings>(key: K, value: typeof settings[K]) {
    patch({ [key]: value } as any);
    await saveSetting(key, value);
  }

  return (
    <Screen title="Settings">
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing.xl, gap: theme.spacing.sm }}>
        <SectionCard label="Appearance">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {Object.values(THEMES).map((t) => {
              const active = t.id === settings.theme;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => update('theme', t.id as ThemeId)}
                  accessibilityRole="button"
                  accessibilityLabel={`${t.label} theme${active ? ', selected' : ''}`}
                  style={{ width: 58, alignItems: 'center', gap: 6 }}
                >
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: t.colors.bgPrimary,
                      borderWidth: active ? 2.5 : 1,
                      borderColor: active ? theme.colors.accent : t.colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: t.colors.accent,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {active ? (
                        <Check size={15} strokeWidth={3} color={t.colors.bgPrimary} />
                      ) : null}
                    </View>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: active ? theme.fonts.uiBold : theme.fonts.ui,
                      fontSize: 10,
                      color: active ? theme.colors.textPrimary : theme.colors.textSecondary,
                    }}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <FieldLabel>Font size</FieldLabel>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {FONT_SIZES.map((f) => {
              const active = f.key === settings.font_size;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => update('font_size', f.key)}
                  accessibilityRole="button"
                  accessibilityLabel={`${f.label} font size${active ? ', selected' : ''}`}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: active ? 1.5 : 1,
                    borderColor: active ? theme.colors.accent : theme.colors.border,
                    backgroundColor: active ? theme.colors.accentSoft : 'transparent',
                  }}
                >
                  {/* Fixed-height box so the three "Aa" previews share a baseline. */}
                  <View style={{ height: 32, justifyContent: 'flex-end' }}>
                    <Text
                      style={{
                        fontFamily: theme.fonts.display,
                        fontSize: f.preview,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      Aa
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: active ? theme.fonts.uiBold : theme.fonts.ui,
                      fontSize: theme.fontSize.xs,
                      color: active ? theme.colors.textPrimary : theme.colors.textSecondary,
                      marginTop: 4,
                    }}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </SectionCard>

        <SectionCard label="Reading">
          <FieldLabel first>Language</FieldLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {LANGUAGES.map((l) => {
              const active = settings.language === l.key;
              return (
                <Pressable
                  key={l.key}
                  onPress={() => update('language', l.key as UiLang)}
                  accessibilityRole="button"
                  accessibilityLabel={`${l.label}${active ? ', selected' : ''}`}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: active ? theme.colors.accent : theme.colors.border,
                    backgroundColor: active ? theme.colors.accent : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: active ? theme.fonts.uiBold : theme.fonts.ui,
                      fontSize: theme.fontSize.sm,
                      color: active ? theme.colors.bgPrimary : theme.colors.textPrimary,
                    }}
                  >
                    {l.label}
                  </Text>
                </Pressable>
              );
            })}
            {LANGUAGES_COMING_SOON.map((label) => (
              <ComingSoonPill key={label} label={label} />
            ))}
          </View>
        </SectionCard>

        <SectionCard label="Goals">
          <FieldLabel first>Daily verse target</FieldLabel>
          <PillRow
            options={DAILY_GOALS.map((n) => ({ key: String(n), label: `${n} verses` }))}
            activeKey={String(settings.daily_goal)}
            onSelect={(k) => update('daily_goal', Number(k))}
          />
        </SectionCard>

        <SectionCard label="About">
          <AboutLine title="Dharma Reader" body="Version 1.0" />
          <AboutLine
            title="Bhagavad Gita"
            body="Sanskrit: Bombay recension (GRETIL). English: Annie Besant & Bhagavan Das, 1905."
          />
          <AboutLine
            title="Ramayana"
            body="Sanskrit: Baroda Critical Edition e-text. English: Manmatha Nath Dutt, 1891–94."
          />
          <AboutLine
            title="Mahabharata"
            body="Sanskrit: BORI Critical Edition e-text (Tokunaga/Smith). English: Manmatha Nath Dutt, 1895–1905."
          />
          <AboutLine
            title="Sources"
            body="All scripture texts are verified public-domain editions. Nothing is machine-generated."
          />
          <MadeByLine />
        </SectionCard>
      </ScrollView>
    </Screen>
  );
}

function SectionCard({ label, children }: { label: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.bgSecondary,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: theme.spacing.sm,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fonts.ui,
          fontSize: theme.fontSize.xs,
          color: theme.colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: theme.spacing.xs,
        }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

function FieldLabel({ children, first }: { children: string; first?: boolean }) {
  const theme = useTheme();
  return (
    <Text
      style={{
        fontFamily: theme.fonts.ui,
        fontSize: theme.fontSize.sm,
        color: theme.colors.textPrimary,
        marginTop: first ? 0 : theme.spacing.sm,
        marginBottom: theme.spacing.xs,
      }}
    >
      {children}
    </Text>
  );
}

function AboutLine({ title, body, last }: { title: string; body: string; last?: boolean }) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: last ? 0 : theme.spacing.xs }}>
      <Text
        style={{
          fontFamily: theme.fonts.uiBold,
          fontSize: theme.fontSize.sm,
          color: theme.colors.textPrimary,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: theme.fonts.ui,
          fontSize: theme.fontSize.sm,
          color: theme.colors.textSecondary,
          lineHeight: theme.fontSize.sm * 1.5,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

function MadeByLine() {
  const theme = useTheme();
  return (
    <View style={{ marginTop: theme.spacing.xs }}>
      <Text
        style={{
          fontFamily: theme.fonts.ui,
          fontSize: theme.fontSize.sm,
          color: theme.colors.textSecondary,
        }}
      >
        Made by Radhe with ❤️
      </Text>
    </View>
  );
}

function ComingSoonPill({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: theme.colors.border,
        opacity: 0.55,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fonts.ui,
          fontSize: theme.fontSize.sm,
          color: theme.colors.textSecondary,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: theme.colors.accentSoft,
          borderRadius: 4,
          paddingHorizontal: 5,
          paddingVertical: 2,
        }}
      >
        <Text
          style={{
            fontFamily: theme.fonts.ui,
            fontSize: 9,
            color: theme.colors.accent,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Soon
        </Text>
      </View>
    </View>
  );
}

function PillRow({
  options,
  activeKey,
  onSelect,
}: {
  options: { key: string; label: string }[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const active = opt.key === activeKey;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onSelect(opt.key)}
            accessibilityRole="button"
            accessibilityLabel={`${opt.label}${active ? ', selected' : ''}`}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: active ? theme.colors.accent : theme.colors.border,
              backgroundColor: active ? theme.colors.accent : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: active ? theme.fonts.uiBold : theme.fonts.ui,
                fontSize: theme.fontSize.sm,
                color: active ? theme.colors.bgPrimary : theme.colors.textPrimary,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
