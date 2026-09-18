import React, { type ReactNode } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  // 'overlay' = fullscreen (used by ChapterSelector)
  // 'transparent' = transparent backdrop (used by ExplainDrawer; drawer styles itself)
  presentation?: 'overlay' | 'transparent';
  children: ReactNode;
  // Optional click-outside backdrop dismissal (transparent presentation only).
  dismissOnBackdropTap?: boolean;
}

// Native uses the real RN Modal (presents above the entire OS window).
// Web renders as an absolutely-positioned overlay so it stays inside the
// phone-frame container — RN's Modal portals to document.body and would
// burst out of the app preview.
export function AppModal({
  visible,
  onRequestClose,
  presentation = 'overlay',
  children,
  dismissOnBackdropTap = false,
}: Props) {
  if (!visible) return null;

  if (Platform.OS !== 'web') {
    return (
      <Modal
        visible={visible}
        onRequestClose={onRequestClose}
        transparent={presentation === 'transparent'}
        animationType={presentation === 'transparent' ? 'none' : 'slide'}
      >
        {children}
      </Modal>
    );
  }

  // Web: absolutely-positioned overlay inside the nearest positioned ancestor
  // (the phone frame container).
  return (
    <View
      style={[
        styles.webOverlay,
        presentation === 'transparent' ? null : styles.webOpaque,
      ]}
      pointerEvents="box-none"
    >
      {dismissOnBackdropTap ? (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onRequestClose}
          accessibilityLabel="Dismiss"
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  webOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Default behaviour: stack above all other screen content.
    zIndex: 9999,
  },
  webOpaque: {
    backgroundColor: 'transparent',
  },
});
