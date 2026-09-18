import React, { type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

// On web, wrap the app in a phone-shaped container so the preview feels like
// an app rather than a webpage: fixed iPhone-class viewport, surrounding
// matte background, internal scroll only.
// On native, this is a transparent passthrough.
export function WebPhoneFrame({ children }: { children: ReactNode }) {
  const theme = useTheme();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // We deliberately drop into raw DOM here because RN Web's CSS pipeline
  // doesn't give us `position: fixed` + viewport math cleanly.
  return (
    <div style={styles.outer as any}>
      <style>{globalCss}</style>
      <div
        style={{
          width: 'min(390px, calc(100vw - 24px))' as any,
          height: 'min(844px, calc(100vh - 24px))' as any,
          borderRadius: 24,
          overflow: 'hidden',
          background: theme.colors.bgPrimary,
          boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 0 6px #1a1a1a, 0 0 0 7px #2a2a2a',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <View style={{ flex: 1, height: '100%' as any, width: '100%' as any }}>{children}</View>
      </div>
    </div>
  );
}

const styles = {
  outer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #2a2a2a 0%, #0d0d0d 100%)',
  },
};

// Global CSS injected once on web: hide browser scrollbars and prevent the
// page itself from scrolling. All scroll happens inside the phone frame.
const globalCss = `
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    background: #0d0d0d;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  ::-webkit-scrollbar { width: 0; height: 0; }
  * { scrollbar-width: none; -ms-overflow-style: none; }
`;
