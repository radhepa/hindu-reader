import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  // 0..1 fraction of the daily goal completed.
  progress: number;
  size?: number;
  strokeWidth?: number;
  // Rendered centered inside the ring (streak badge).
  children?: ReactNode;
}

// Daily goal ring per UI.md — draws from its previous value over 800ms.
// Animated with rAF + state (not Animated/native-driver) so the SVG stroke
// updates identically on web and native.
export function GoalRing({ progress, size = 132, strokeWidth = 10, children }: Props) {
  const theme = useTheme();
  const target = Math.min(1, Math.max(0, progress));
  const [drawn, setDrawn] = useState(0);
  const drawnRef = useRef(0);

  useEffect(() => {
    const from = drawnRef.current;
    const start = Date.now();
    const duration = 800;
    let raf: number;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      drawnRef.current = v;
      setDrawn(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const r = (size - strokeWidth) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={c}
          cy={c}
          r={r}
          stroke={theme.colors.accentSoft}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Transform string (not rotation/origin props) — the prop form emits
            an invalid transform-origin DOM attribute on react-native-web.
            Rotated -90° so the stroke starts at 12 o'clock. */}
        <Circle
          cx={c}
          cy={c}
          r={r}
          stroke={theme.colors.accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference * (1 - drawn)}
          fill="none"
          transform={`rotate(-90 ${c} ${c})`}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </View>
  );
}
