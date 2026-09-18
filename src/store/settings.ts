import { create } from 'zustand';
import { DEFAULT_SETTINGS, type AppSettings } from '@/types/settings';

interface SettingsState {
  settings: AppSettings;
  hydrated: boolean;
  // Replace the full settings object (used after DB load).
  hydrate: (s: AppSettings) => void;
  // Update one or more keys; persistence is handled in db/settings layer
  // (subscribers can listen and write through).
  patch: <K extends keyof AppSettings>(patch: Pick<AppSettings, K>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  hydrated: false,
  hydrate: (s) => set({ settings: s, hydrated: true }),
  patch: (p) => set((state) => ({ settings: { ...state.settings, ...p } })),
}));
