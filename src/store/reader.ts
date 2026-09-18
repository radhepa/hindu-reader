import { create } from 'zustand';
import type { BookId } from '@/types/scripture';

interface ReaderState {
  activeBookId: BookId | null;
  activeChapter: number | null;
  // Verse id to scroll to on next reader mount (e.g. when opening from
  // the Library at the last-read position, or from a daily-quote tap).
  pendingScrollVerseId: string | null;

  openBook: (id: BookId, chapter: number, verseId?: string) => void;
  setChapter: (chapter: number) => void;
  setPendingScroll: (verseId: string | null) => void;
  closeBook: () => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  activeBookId: null,
  activeChapter: null,
  pendingScrollVerseId: null,
  openBook: (id, chapter, verseId) =>
    set({
      activeBookId: id,
      activeChapter: chapter,
      pendingScrollVerseId: verseId ?? null,
    }),
  setChapter: (chapter) => set({ activeChapter: chapter, pendingScrollVerseId: null }),
  setPendingScroll: (verseId) => set({ pendingScrollVerseId: verseId }),
  closeBook: () =>
    set({ activeBookId: null, activeChapter: null, pendingScrollVerseId: null }),
}));
