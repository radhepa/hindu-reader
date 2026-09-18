import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { getBook } from '@/lib/scripture';
import { AppModal } from '@/components/AppModal';
import type { BookId } from '@/types/scripture';

interface Props {
  bookId: BookId;
  visible: boolean;
  activeChapter: number;
  onSelect: (chapter: number) => void;
  onClose: () => void;
}

export function ChapterSelector({ bookId, visible, activeChapter, onSelect, onClose }: Props) {
  const theme = useTheme();
  const book = getBook(bookId);

  return (
    <AppModal visible={visible} presentation="overlay" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.colors.bgPrimary }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacing.md,
            paddingTop: 16,
            paddingBottom: theme.spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.display,
              fontSize: theme.fontSize.lg,
              color: theme.colors.textPrimary,
            }}
          >
            {book.meta.title}
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close chapter list"
          >
            <X size={22} strokeWidth={1.5} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
        <FlatList
          data={book.chapters}
          keyExtractor={(c) => String(c.number)}
          contentContainerStyle={{ paddingVertical: theme.spacing.xs }}
          renderItem={({ item }) => {
            const active = item.number === activeChapter;
            return (
              <Pressable
                onPress={() => onSelect(item.number)}
                accessibilityRole="button"
                style={{
                  width: '100%',
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  backgroundColor: active ? theme.colors.accentSoft : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.ui,
                    fontSize: theme.fontSize.xs,
                    color: theme.colors.textSecondary,
                    marginBottom: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {book.meta.structure_label} {item.number}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: theme.fontSize.base,
                    color: theme.colors.textPrimary,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.ui,
                    fontSize: theme.fontSize.xs,
                    color: theme.colors.textSecondary,
                    marginTop: 4,
                  }}
                >
                  {item.verse_count} verses
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </AppModal>
  );
}
