import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useSettingsStore } from '@/store/settings';
import { resolveExplanation, verseShortLabel } from '@/lib/scripture';
import { AppModal } from '@/components/AppModal';
import type { Verse } from '@/types/scripture';

interface Props {
  verse: Verse | null;
  visible: boolean;
  onClose: () => void;
}

export function ExplainDrawer({ verse, visible, onClose }: Props) {
  const theme = useTheme();
  const lang = useSettingsStore((s) => s.settings.language);
  const screenH = Dimensions.get('window').height;
  const drawerH = Math.round(screenH * 0.55);

  // translateY tracks the drawer's offset from its resting (open) position.
  // 0 = open, drawerH = closed (off-screen). Used for both slide-in animation
  // and swipe-down dismiss gesture.
  const translateY = useRef(new Animated.Value(drawerH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 280,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.4,
          duration: 280,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: drawerH,
          duration: 220,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [visible, drawerH]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 4 && Math.abs(g.dx) < Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: Platform.OS !== 'web' }).start();
        }
      },
    })
  ).current;

  if (!verse) return null;
  const explanation = resolveExplanation(verse, lang);

  return (
    <AppModal visible={visible} onRequestClose={onClose} presentation="transparent">
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Dark scrim — purely visual, does not intercept taps */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,1)', opacity: backdropOpacity },
          ]}
        />
        {/* Dismiss area: only the region above the drawer so the tab bar stays tappable */}
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: drawerH }}
          onPress={onClose}
          accessibilityLabel="Close explanation"
        />

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.drawer,
            {
              height: drawerH,
              backgroundColor: theme.colors.bgPrimary,
              borderColor: theme.colors.border,
              transform: [{ translateY }],
              // Per DONTS.md: shadows only on floating elements — drawer qualifies.
              ...(Platform.OS === 'web'
                ? { boxShadow: '0 -4px 16px rgba(0,0,0,0.18)' as any }
                : {
                    shadowColor: '#000',
                    shadowOpacity: 0.18,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: -4 },
                    elevation: 12,
                  }),
            },
          ]}
        >
          {/* Drawer handle */}
          <View
            style={{
              width: 44,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.colors.border,
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: theme.spacing.sm,
            }}
          />
          <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingTop: 0, paddingBottom: theme.spacing.xl }}>
            {/* Reference pill */}
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: theme.colors.accentSoft,
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 999,
                marginBottom: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.ui,
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.textPrimary,
                }}
              >
                {verseShortLabel(verse)}
              </Text>
            </View>

            {/* Sanskrit snippet, small */}
            <Text
              style={{
                fontFamily: theme.fonts.devanagari,
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                lineHeight: theme.fontSize.sm * 1.9,
                marginBottom: theme.spacing.md,
              }}
            >
              {verse.sanskrit}
            </Text>

            {/* Heading */}
            <Text
              style={{
                fontFamily: theme.fonts.display,
                fontSize: theme.fontSize.lg,
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.sm,
              }}
            >
              What this means
            </Text>

            {/* Body */}
            <Text
              style={{
                fontFamily: theme.fonts.body,
                fontSize: theme.fontSize.base,
                color: theme.colors.textPrimary,
                lineHeight: theme.fontSize.base * 1.7,
                textAlign: 'left',
              }}
            >
              {explanation?.text ??
                'No explanation available for this verse in the selected language yet. Explanations are part of the content sourcing track — see CONTENT_STATUS.md.'}
            </Text>
          </ScrollView>
        </Animated.View>
      </View>
    </AppModal>
  );
}


const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
});
