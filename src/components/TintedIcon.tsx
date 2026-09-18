import React from 'react';
import { Image, Platform, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

// Cross-platform tinted icon.
// - Native: <Image tintColor /> recolors the source pixels.
// - Web: <Image tintColor /> on RN-Web 0.21 doesn't always wire mask-image,
//   so we apply it manually via CSS mask so the icon picks up the theme color.
// Source PNG should be a black silhouette on transparent background.

interface Props {
  source: ImageSourcePropType;
  size: number;
  tintColor: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  // Per-icon focal-point nudge in pixels. Use when a source PNG has the
  // visual subject (deity face) offset from the canvas midpoint, so contain
  // mode centers by canvas rather than by face. Positive y = down.
  offset?: { x?: number; y?: number };
}

function resolveUrl(source: ImageSourcePropType): string | null {
  if (typeof source === 'number') {
    // Metro-bundled require() returns a numeric asset id; RN-Web resolves
    // this via Image.resolveAssetSource.
    const resolved = Image.resolveAssetSource(source);
    return resolved?.uri ?? null;
  }
  if (typeof source === 'object' && source && 'uri' in source) {
    return (source as { uri: string }).uri;
  }
  return null;
}

export function TintedIcon({
  source,
  size,
  tintColor,
  accessibilityLabel,
  style,
  offset,
}: Props) {
  const dx = offset?.x ?? 0;
  const dy = offset?.y ?? 0;
  const transform =
    dx !== 0 || dy !== 0 ? [{ translateX: dx }, { translateY: dy }] : undefined;

  if (Platform.OS !== 'web') {
    return (
      <Image
        source={source}
        tintColor={tintColor}
        resizeMode="contain"
        style={[{ width: size, height: size, transform }, style] as any}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  const uri = resolveUrl(source);
  if (!uri) {
    return (
      <Image
        source={source}
        resizeMode="contain"
        style={[{ width: size, height: size, transform }, style] as any}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  // Render a View with mask-image. RN-Web doesn't support these style props
  // directly, so drop into a DOM div via View → expose via `style as any`.
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          width: size,
          height: size,
          backgroundColor: tintColor,
          transform,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...({
            maskImage: `url("${uri}")`,
            WebkitMaskImage: `url("${uri}")`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
          } as any),
        },
        style,
      ]}
    />
  );
}
