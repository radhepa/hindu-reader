import React, { useCallback, useRef, type ReactNode } from 'react';
import { Animated, Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';

interface ScreenProps {
  title?: string;
  children: ReactNode;
  contentStyle?: ViewStyle;
}

export function Screen({ title, children, contentStyle }: ScreenProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 210,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 210,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
      return () => {
        opacity.setValue(0);
        translateY.setValue(10);
      };
    }, [])
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: theme.colors.bgPrimary }]}
    >
      {title ? (
        <View style={[styles.titleRow, { paddingHorizontal: theme.spacing.md }]}>
          <Text
            style={{
              fontFamily: theme.fonts.display,
              fontSize: theme.fontSize.xl,
              color: theme.colors.textPrimary,
            }}
          >
            {title}
          </Text>
          {/* Short accent rule — gives titles the deliberate, printed-book feel. */}
          <View
            style={{
              height: 3,
              width: 32,
              borderRadius: 2,
              backgroundColor: theme.colors.accent,
              marginTop: 8,
              opacity: 0.85,
            }}
          />
        </View>
      ) : null}
      <Animated.View
        style={[
          styles.content,
          contentStyle,
          { opacity },
          Platform.OS !== 'web' ? { transform: [{ translateY }] } : null,
        ]}
      >
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  titleRow: { paddingTop: 12, paddingBottom: 12 },
  content: { flex: 1 },
});
