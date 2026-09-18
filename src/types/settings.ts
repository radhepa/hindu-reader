// User-facing settings stored in SQLite settings table.
// Keys mirror DATA.md §4.
//
// V1 simplification: a single `language` setting drives BOTH the translation
// shown in the Reader and the explanation language. Sanskrit and Roman
// (transliteration) are always rendered above the translation as part of the
// verse block, so they don't need to be picker options.

import type { UiLang } from './scripture';

export type ThemeId = 'lotus' | 'ashram' | 'night_puja' | 'saffron' | 'minimalist';
export type FontSize = 'small' | 'medium' | 'large';

export interface AppSettings {
  theme: ThemeId;
  language: UiLang;
  daily_goal: number;
  timer_enabled: boolean;
  notification_enabled: boolean;
  notification_time: string; // HH:mm, 24h
  font_size: FontSize;
  user_name: string; // for greeting + certificate, optional
  onboarding_complete: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'lotus',
  language: 'en',
  daily_goal: 10,
  timer_enabled: false,
  notification_enabled: false,
  notification_time: '07:30',
  font_size: 'medium',
  user_name: '',
  onboarding_complete: false,
};
