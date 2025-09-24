import GroundwaterChart from '@/components/GroundwaterChart';
import RainfallChart from '@/components/RainfallChart';
import RechargeAvailabilityCard from '@/components/RechargeAvailabilityCard';
import RechargeEstimationGraph from '@/components/RechargeEstimationGraph';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const waveAnimation = useRef(new Animated.Value(0)).current;
  
  const setOffset = (section: string) => () => {
    // Placeholder for offset handling if needed
    console.log(`Setting offset for ${section}`);
  };

  useEffect(() => {
    // Start wave animation with reload cycle
    const animateWave = () => {
      Animated.loop(
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        })
      ).start();
    };
    
    // Start initial animation
    animateWave();
    
    // Reload animation every 10 seconds
    const reloadInterval = setInterval(() => {
      // Reset animation value
      waveAnimation.setValue(0);
      // Restart animation
      animateWave();
    }, 10000);
    
    // Cleanup interval on unmount
    return () => clearInterval(reloadInterval);
  }, [waveAnimation]);

  const colors = {
    background: colorScheme === 'light' ? Colors.light.backgroundSoft : '#1a1a2e',
    heroBackground: colorScheme === 'light' ? Colors.light.cardBackground : '#16213e',
    text: colorScheme === 'light' ? Colors.light.text : '#ffffff',
    textSecondary: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)',
    primary: colorScheme === 'light' ? Colors.light.primary : '#64b5f6',
    cardBackground: colorScheme === 'light' ? Colors.light.cardBackground : '#16213e',
    cardBorder: colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.1)',
    pillBackground: colorScheme === 'light' ? Colors.light.statusMedium : '#f59e42',
    pillText: colorScheme === 'light' ? '#ffffff' : '#ffffff',
  };

  const parameterIcons = [
    { 
      icon: 'weather-rainy', 
      color: colorScheme === 'light' ? Colors.light.primary : '#3b82f6', 
      bg: colorScheme === 'light' ? Colors.light.primary + '15' : '#3b82f615',
      name: 'Rainfall'
    },
    { 
      icon: 'arrow-down', 
      color: colorScheme === 'light' ? Colors.light.secondary : '#06b6d4', 
      bg: colorScheme === 'light' ? Colors.light.secondary + '15' : '#06b6d415',
      name: 'Depth'
    },
    { 
      icon: 'layers', 
      color: colorScheme === 'light' ? Colors.light.statusHigh : '#84cc16', 
      bg: colorScheme === 'light' ? Colors.light.statusHigh + '15' : '#84cc1615',
      name: 'Soil'
    },
    { 
      icon: 'water-pump', 
      color: colorScheme === 'light' ? Colors.light.statusMedium : '#f59e0b', 
      bg: colorScheme === 'light' ? Colors.light.statusMedium + '15' : '#f59e0b15',
      name: 'Usage'
    },
  ];

  const commonContent = (
    <>
      {/* Hero Section - Clean Design with Animated Wave */}
      <View style={[styles.hero, { backgroundColor: colors.background }]}>
        {/* Full Screen Animated Wave Background */}
        <Svg height="100%" width="120%" style={styles.wave} viewBox="0 0 120 100" preserveAspectRatio="none">
          <AnimatedPath
            d={waveAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                "M-20 45 Q 10 30, 30 45 Q 50 60, 70 45 Q 90 30, 110 45 Q 130 60, 150 45 V100 H-20 Z",
                "M-10 40 Q 15 55, 35 40 Q 55 25, 75 40 Q 95 55, 115 40 Q 135 25, 155 40 V100 H-10 Z",
                "M0 45 Q 20 30, 40 45 Q 60 60, 80 45 Q 100 30, 120 45 Q 140 60, 160 45 V100 H0 Z"
              ]
            })}
            fill={colorScheme === 'light' ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.35)'}
          />
          <AnimatedPath
            d={waveAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                "M-25 60 Q 5 45, 25 60 Q 45 75, 65 60 Q 85 45, 105 60 Q 125 75, 145 60 Q 165 45, 185 60 V100 H-25 Z",
                "M-15 55 Q 10 70, 30 55 Q 50 40, 70 55 Q 90 70, 110 55 Q 130 40, 150 55 Q 170 70, 190 55 V100 H-15 Z",
                "M0 60 Q 25 45, 45 60 Q 65 75, 85 60 Q 105 45, 125 60 Q 145 75, 165 60 Q 185 45, 205 60 V100 H0 Z"
              ]
            })}
            fill={colorScheme === 'light' ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.20)'}
          />
          <AnimatedPath
            d={waveAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                "M-30 75 Q 0 60, 20 75 Q 40 90, 60 75 Q 80 60, 100 75 Q 120 90, 140 75 Q 160 60, 180 75 Q 200 90, 220 75 V100 H-30 Z",
                "M-20 70 Q 5 85, 25 70 Q 45 55, 65 70 Q 85 85, 105 70 Q 125 55, 145 70 Q 165 85, 185 70 Q 205 55, 225 70 V100 H-20 Z",
                "M0 75 Q 30 60, 50 75 Q 70 90, 90 75 Q 110 60, 130 75 Q 150 90, 170 75 Q 190 60, 210 75 Q 230 90, 250 75 V100 H0 Z"
              ]
            })}
            fill={colorScheme === 'light' ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)'}
          />
        </Svg>

        <View style={styles.heroContent}>
          {/* Text Content with Bold Styling */}
          <ThemedText style={[styles.heroGreeting, { 
            color: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.9)',
            fontWeight: '700',
          }]}>Current Water Level</ThemedText>
          <ThemedText style={[styles.heroValue, { 
            color: colorScheme === 'light' ? Colors.light.text : '#ffffff',
            fontWeight: '700',
          }]}>7.8 M</ThemedText>
          <View style={styles.heroMetrics}>
            <View style={styles.metricItem}>
              <ThemedText style={[styles.metricValue, {
                color: colorScheme === 'light' ? Colors.light.text : '#2af575ff',
                fontWeight: '800',
              }]}>+0.3m</ThemedText>
              <ThemedText style={[styles.metricLabel, { 
                color: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.8)',
                fontWeight: '600',
              }]}>in 15 days</ThemedText>
            </View>
            <View style={[styles.metricDivider, { 
              backgroundColor: colorScheme === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)',
            }]} />
            <View style={styles.metricItem}>
              <ThemedText style={[styles.metricValue, { 
                color: colorScheme === 'light' ? Colors.light.text : '#22dafbff',
                fontWeight: '800',
              }]}>Normal</ThemedText>
              <ThemedText style={[styles.metricLabel, { 
                color: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.8)',
                fontWeight: '600',
              }]}>Status</ThemedText>
            </View>
          </View>
          
          {/* Alert Banner with Enhanced Visibility */}
          <View style={[styles.alertBanner, { 
            backgroundColor: colorScheme === 'light' ? 'rgba(245, 158, 66, 0.95)' : 'rgba(245, 158, 66, 0.9)',
            borderColor: colorScheme === 'light' ? 'rgba(245, 158, 66, 0.8)' : 'rgba(245, 158, 66, 0.7)',
          }]}>
            <View style={[styles.alertIndicator, { backgroundColor: '#ffffff' }]} />
            <ThemedText style={[styles.alertText, { 
              color: '#ffffff',
              fontWeight: '600',
            }]}>Orange Alert for Thunderstorms</ThemedText>
          </View>
        </View>
      </View>

      {/* Main Content Cards */}
      <View style={styles.cardContainer}>
        {/* Core Groundwater Data */}
        <View onLayout={setOffset('core')} style={[
          styles.cardShadow,
          colorScheme === 'light' ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          } : {}
        ]}>
          <ThemedView style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            }
          ]}> 
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, {
                backgroundColor: colorScheme === 'light' ? Colors.light.primary + '15' : '#2563eb15'
              }]}>
                <Ionicons 
                  name="water" 
                  size={24} 
                  color={colors.primary} 
                />
              </View>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>Groundwater Level</ThemedText>
            </View>
                   
            <View style={styles.chartContainer}>
              <GroundwaterChart variant={colorScheme === 'light' ? 'light' : 'dark'} />
            </View>
          </ThemedView>
        </View>

        {/* Modern Recharge Estimation Graph */}
        <View onLayout={setOffset('recharge-graph')}>
          <RechargeEstimationGraph />
        </View>

        <View onLayout={setOffset('recharge')}>
          <RechargeAvailabilityCard />
        </View>

        {/* Rainfall & Climate */}
        <View onLayout={setOffset('rainfall')} style={[
          styles.cardShadow,
          colorScheme === 'light' ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          } : {}
        ]}>
          <ThemedView style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            }
          ]}> 
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, {
                backgroundColor: colorScheme === 'light' ? Colors.light.statusMedium + '15' : '#f59e4215'
              }]}>
                <MaterialCommunityIcons 
                  name="weather-partly-cloudy" 
                  size={24} 
                  color={colorScheme === 'light' ? Colors.light.statusMedium : '#f59e42'} 
                />
              </View>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>Rainfall & Climate</ThemedText>
            </View>
            <ThemedText style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Weather patterns and climate data</ThemedText>
            
            <View style={[styles.dataRow, { borderBottomColor: colors.cardBorder }]}>
              <ThemedText style={[styles.dataLabel, { color: colors.textSecondary }]}>Today&apos;s Rainfall</ThemedText>
              <ThemedText style={[styles.dataValue, { color: colors.text }]}>22mm</ThemedText>
            </View>
            <View style={[styles.dataRow, { borderBottomColor: colors.cardBorder }]}>
              <ThemedText style={[styles.dataLabel, { color: colors.textSecondary }]}>Humidity</ThemedText>
              <ThemedText style={[styles.dataValue, { color: colors.text }]}>48%</ThemedText>
            </View>
            <View style={[styles.dataRow, { borderBottomColor: colors.cardBorder }]}>
              <ThemedText style={[styles.dataLabel, { color: colors.textSecondary }]}>Temperature</ThemedText>
              <ThemedText style={[styles.dataValue, { color: colors.text }]}>32°C</ThemedText>
            </View>

            <View style={styles.chartContainer}>
              <RainfallChart variant={colorScheme === 'light' ? 'light' : 'dark'} />
            </View>
          </ThemedView>
        </View>

        {/* Parameter Icons Section */}
        <View onLayout={setOffset('parameters')} style={[
          styles.cardShadow,
          colorScheme === 'light' ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          } : {}
        ]}>
          <ThemedView style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { 
                backgroundColor: colorScheme === 'light' ? '#8b5cf615' : '#8b5cf615' 
              }]}>
                <MaterialCommunityIcons name="view-dashboard" size={24} color="#8b5cf6" />
              </View>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>Parameters</ThemedText>
            </View>
            <ThemedText style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Key monitoring parameters</ThemedText>
            
            <View style={styles.parameterRowInline}>
              {parameterIcons.map((param, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.parameterInlineItem, {
                    backgroundColor: colorScheme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)',
                    borderColor: colors.cardBorder,
                  }]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.parameterInlineIcon, { 
                    backgroundColor: param.bg,
                    borderColor: colors.cardBorder,
                  }]}>
                    <MaterialCommunityIcons
                      name={param.icon as any}
                      size={22}
                      color={param.color}
                    />
                  </View>
                  <ThemedText style={[styles.parameterInlineName, { color: colors.text }]}>{param.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>
        </View>
      </View>
    </>
  );

  return (
    <>
      {colorScheme === 'light' ? (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: (Platform.OS === 'android' ? 100 : 60) + insets.bottom,
            }}
            bounces={Platform.OS === 'ios'}
          >
            {commonContent}
          </ScrollView>
        </View>
      ) : (
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.container}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: (Platform.OS === 'android' ? 100 : 60) + insets.bottom,
            }}
            bounces={Platform.OS === 'ios'}
          >
            {commonContent}
          </ScrollView>
        </LinearGradient>
      )}

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    position: 'relative',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 24,
    marginBottom: 6,
    minHeight: 350,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    bottom: 0,
    zIndex: 0,
    width: '120%',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: '100%',
    zIndex: 2,
    paddingVertical: 40,
  },
  heroGreeting: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroValue: {
    fontSize: 50,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 64,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  metricItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 20,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: '100%',
  },
  alertIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardShadow: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dataLabel: {
    fontSize: 16,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  parameterRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  parameterInlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    width: '48%',
    marginBottom: 10,
  },
  parameterInlineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
  },
  parameterInlineName: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});