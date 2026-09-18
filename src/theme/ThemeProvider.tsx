import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useSettingsStore } from '@/store/settings';
import { THEMES, SPACING, FONT_SIZE, FONTS, type ColorTokens } from './tokens';
import type { FontSize } from '@/types/settings';

// Settings → Font size multipliers. Applied to the whole type scale so every
// screen (Reader, Home, Library…) re-renders at the new size in place.
const FONT_SCALE: Record<FontSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.15,
};

export type FontSizeScale = Record<keyof typeof FONT_SIZE, number>;

export interface Theme {
  id: string;
  colors: ColorTokens;
  spacing: typeof SPACING;
  fontSize: FontSizeScale;
  fonts: typeof FONTS;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeId = useSettingsStore((s) => s.settings.theme);
  const fontSizeId = useSettingsStore((s) => s.settings.font_size);
  const value = useMemo<Theme>(() => {
    const t = THEMES[themeId];
    const scale = FONT_SCALE[fontSizeId] ?? 1;
    const fontSize = Object.fromEntries(
      (Object.keys(FONT_SIZE) as (keyof typeof FONT_SIZE)[]).map((k) => [
        k,
        Math.round(FONT_SIZE[k] * scale),
      ])
    ) as FontSizeScale;
    return {
      id: t.id,
      colors: t.colors,
      spacing: SPACING,
      fontSize,
      fonts: FONTS,
    };
  }, [themeId, fontSizeId]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
