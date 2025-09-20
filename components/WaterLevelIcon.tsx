import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface WaterLevelIconProps {
  size?: number;
  color?: string;
  isPositive?: boolean;
}

export default function WaterLevelIcon({ 
  size = 80, 
  color = '#3498db',
  isPositive = true
}: WaterLevelIconProps) {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  const translateY = useSharedValue(0);
  
  // Ripple animation values
  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0.7);

  useEffect(() => {
    // Main icon animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    // Water movement animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(isPositive ? -5 : 5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    // Ripple effect animation
    rippleScale.value = withRepeat(
      withDelay(
        500,
        withSequence(
          withTiming(1, { duration: 100 }),
          withTiming(1.5, { duration: 1000, easing: Easing.out(Easing.ease) })
        )
      ),
      -1,
      false
    );
    
    rippleOpacity.value = withRepeat(
      withDelay(
        500,
        withSequence(
          withTiming(0.5, { duration: 100 }),
          withTiming(0, { duration: 1000 })
        )
      ),
      -1,
      false
    );
  }, [isPositive, scale, translateY, rippleScale, rippleOpacity]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    };
  });
  
  const rippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Ripple effect */}
      <Animated.View 
        style={[
          styles.ripple, 
          { width: size * 1.2, height: size * 1.2, borderRadius: size * 0.6 },
          rippleStyle
        ]} 
      />
      
      {/* Main animated icon */}
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <LinearGradient
          colors={isPositive ? ['#10b981', '#34d399'] : ['#f59e0b', '#fbbf24']}
          style={[styles.gradient, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <Ionicons 
            name={isPositive ? "water" : "water-outline"} 
            size={size * 0.5} 
            color="#ffffff" 
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    zIndex: 1,
  }
});