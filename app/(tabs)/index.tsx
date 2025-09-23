import GroundwaterChart from '@/components/GroundwaterChart';
import RainfallChart from '@/components/RainfallChart';
import RechargeAvailabilityCard from '@/components/RechargeAvailabilityCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import WaterLevelIcon from '@/components/WaterLevelIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const setOffset = (section: string) => () => {
    // Placeholder for offset handling if needed
    console.log(`Setting offset for ${section}`);
  };

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
      {/* Hero Section */}
      <View style={[
        styles.hero, 
        { 
          backgroundColor: colors.heroBackground,
          borderColor: colors.cardBorder,
          ...(colorScheme === 'light' ? {
            borderWidth: 1,
            borderRadius: 20,
            marginHorizontal: 16,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          } : {})
        }
      ]}>
        <WaterLevelIcon size={90} isPositive={true} />
        <ThemedText style={[styles.heroValue, { color: colors.text }]}>7.8 M</ThemedText>
        <ThemedText style={[styles.heroLabel, { color: colors.textSecondary }]}>Water Level</ThemedText>
        <ThemedText style={[styles.heroChange, {color: colorScheme === 'light' ? Colors.light.statusHigh : '#10b981'}]}>+0.3m (4.3%)</ThemedText>
        <View style={[styles.heroPill, { 
          backgroundColor: colors.pillBackground,
          borderWidth: colorScheme === 'light' ? 1 : 0,
          borderColor: colorScheme === 'light' ? colors.cardBorder : 'transparent'
        }]}>
          <ThemedText style={[styles.heroPillText, { color: colors.pillText }]}>Orange Alert for Thunderstorms</ThemedText>
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
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 20,
    backgroundColor: '#16213e',
    marginBottom: 20,
    minHeight: 320,
  },
  heroValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 56,
  },
  heroLabel: {
    fontSize: 18,
    marginBottom: 12,
  },
  heroChange: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  heroPill: {
    backgroundColor: '#f59e42',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroPillText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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