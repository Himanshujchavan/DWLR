import React, { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';



interface SplashProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashProps) {
  const [rippleActive, setRippleActive] = useState(false);
  const [waveHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    setRippleActive(true);
    const waveTimer = setTimeout(() => {
      Animated.timing(waveHeight, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && onComplete) {
          onComplete();
        }
      });
    }, 1000);
    return () => clearTimeout(waveTimer);
  }, [waveHeight, onComplete]);

  const animatedWaveHeight = waveHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Animated water wave background */}
      <Animated.View
        style={[
          styles.waveBackground,
          { height: animatedWaveHeight },
        ]}
      >
        <View style={styles.wave} />
      </Animated.View>
      {/* Logo with ripple effect */}
      <View style={styles.logoContainer}>
        <View style={[styles.ripple, rippleActive && styles.rippleActive]} />
        <View style={styles.logoCircle}>
          <View style={styles.logoInnerCircle}>
            <Image
              source={require('../assets/images/DWLR.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.title}>BhuJal</Text>
        <Text style={styles.subtitle}>Smart GroundWater Management</Text>
      </View>
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#38bdf8',
    overflow: 'hidden',
  },
  wave: {
    height: 32,
    backgroundColor: '#60a5fa',
    opacity: 0.7,
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#38bdf8',
    opacity: 0.2,
  },
  rippleActive: {
    opacity: 0.5,
  },
  logoCircle: {
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 12,
  },
  logoInnerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  logoText: {
    fontSize: 36,
    color: '#fff',
  },
  title: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0e2954',
  },
  subtitle: {
    fontSize: 16,
    color: '#2563eb',
    marginTop: 4,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7dd3fc',
  },
});
