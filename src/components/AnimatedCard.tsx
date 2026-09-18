import React, { useRef, type ReactNode } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

// Drop-in replacement for Pressable that adds a spring press-scale feedback.
// The scale animates the Animated.View (visual card), not the Pressable itself,
// so the tap target and layout dimensions don't change on press.
export function AnimatedCard({ onPress, style, children, ...rest }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: Platform.OS !== 'web',
      speed: 60,
      bounciness: 0,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 20,
      bounciness: 5,
    }).start();

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} {...rest}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
