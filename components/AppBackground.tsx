import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface AppBackgroundProps {
  particles?: boolean;
  waveColor?: string;
  waveTopColor?: string; // lighter overlay wave
  waveHeight?: number; // base height in px
  variant?: 'light' | 'dark' | 'brand';
  accent?: string; // optional accent override
}

// Re-usable app background that visually aligns with the SplashScreen
export const AppBackground: React.FC<AppBackgroundProps> = ({
  particles = true,
  waveColor,
  waveTopColor,
  waveHeight = 120,
  variant = 'light',
  accent,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const particlesAnim = useRef(new Animated.Value(0)).current;

  // Derive palette from variant
  const palette = useMemo(() => {
    switch (variant) {
      case 'dark':
        return {
          bg: '#0f172a',
          wave: waveColor || '#1e3a8a',
          waveTop: waveTopColor || '#334155',
          particle: '#3b82f6',
        };
      case 'brand':
        return {
          bg: '#e0f2fe',
          wave: waveColor || '#0284c7',
          waveTop: waveTopColor || '#38bdf8',
          particle: '#7dd3fc',
        };
      case 'light':
      default:
        return {
          bg: '#e0f2fe',
          wave: waveColor || '#38bdf8',
          waveTop: waveTopColor || '#60a5fa',
          particle: '#7dd3fc',
        };
    }
  }, [variant, waveColor, waveTopColor]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 4800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 4800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  // Particle drift animation (single value drives small position shifts + opacity pulsing)
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(particlesAnim, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(particlesAnim, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [particlesAnim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const scaleX = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const particleDriftY = particlesAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  const particlePositions = useMemo(
    () => Array.from({ length: particles ? 18 : 0 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 5 + Math.random() * 7,
      opacity: 0.25 + Math.random() * 0.35,
      drift: Math.random() * 10 + 4,
      delay: Math.random() * 4000,
    })),
    [particles]
  );

  return (
    <View pointerEvents="none" style={[styles.container, { backgroundColor: palette.bg }]}>
      <LinearGradient
        colors={[palette.bg, palette.bg + '00']}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
      {/* Particles */}
      {particlePositions.map((p, idx) => (
        <Animated.View
          key={idx}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: accent || palette.particle,
            opacity: p.opacity,
            transform: [
              { translateY: Animated.add(particleDriftY, new Animated.Value(-p.drift / 2)) },
              { translateX: new Animated.Value(Math.sin(p.delay) * 2) },
            ],
          }}
        />
      ))}
      {/* Wave base */}
      <Animated.View
        style={[
          styles.waveBase,
          { height: waveHeight, backgroundColor: palette.wave, transform: [{ translateY }] },
        ]}
      />
      {/* Wave highlight */}
      <Animated.View
        style={[
          styles.waveTop,
          { height: waveHeight / 4, backgroundColor: palette.waveTop, transform: [{ translateY }, { scaleX }] },
        ]}
      />
      {/* Gloss highlight */}
      <LinearGradient
        colors={['#ffffff55', '#ffffff00']}
        style={[styles.gloss, { bottom: waveHeight - waveHeight / 4 }]}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 220,
  },
  waveBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },
  waveTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  gloss: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
  },
});
