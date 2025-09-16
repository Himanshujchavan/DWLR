import AppNavbar from '@/components/AppNavbar';
import GroundwaterChart from '@/components/GroundwaterChart';
import RainfallChart from '@/components/RainfallChart';
import { SplashScreen } from '@/components/SplashScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function GroundwaterDashboard() {
  const [showSplash, setShowSplash] = useState(true);
  const insets = useSafeAreaInsets();
  // Scroll handling for search
  const scrollRef = useRef<ScrollView | null>(null);
  const [yOffsets, setYOffsets] = useState<Record<string, number>>({});

  const setOffset = (key: string) => (e: any) => {
    const y = e.nativeEvent?.layout?.y ?? 0;
    setYOffsets(prev => ({ ...prev, [key]: y }));
  };

  const handleSearch = (q: string) => {
    const query = (q || '').toLowerCase();
    const key =
      query.includes('core') || query.includes('level') ? 'core' :
      query.includes('recharge') || query.includes('availability') ? 'recharge' :
      query.includes('rain') || query.includes('climate') || query.includes('weather') ? 'rainfall' :
      query.includes('usage') || query.includes('use') ? 'quality' :
      query.includes('quality') || query.includes('ph') || query.includes('tds') ? 'quality' :
      query.includes('aquifer') || query.includes('geolog') ? 'aquifer' : 'core';

    const y = yOffsets[key] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(y - 60, 0), animated: true });
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <LinearGradient
      colors={['#1a237e', '#283593', '#3949ab']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: Platform.OS === 'android' ? 100 + insets.bottom : 100 }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
      >
      <AppNavbar onSearch={handleSearch} />

       {/* Hero Header */}
       <View style={styles.hero}>
        <ThemedText style={styles.heroValue}>7.2m</ThemedText>
        <ThemedText style={styles.heroLabel}>Water Level</ThemedText>
        <ThemedText style={[styles.heroChange, {color: '#10b981'}]}>+0.3m (4.3%)</ThemedText>
        <View style={styles.heroPill}>
          <ThemedText style={styles.heroPillText}>Orange Alert for Thunderstorms</ThemedText>
        </View>
       </View>      {/* Quick Stats Cards Row */}


      {/* Main Content Cards */}
      <View style={styles.cardContainer}>
        {/* Core Groundwater Data */}
        <View onLayout={setOffset('core')}>
        <ThemedView style={styles.card}> 
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, {backgroundColor: '#2563eb15'}]}>
              <Ionicons name="water" size={24} color="#2563eb" />
            </View>
            <ThemedText style={styles.cardTitle}>Core Groundwater Data</ThemedText>
          </View>
          <ThemedText style={styles.cardSubtitle}>Real-time monitoring and trends</ThemedText>
          
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Real-time Level</ThemedText>
            <ThemedText style={styles.dataValue}>7.2m (Safe)</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Trend</ThemedText>
            <ThemedText style={[styles.dataValue, {color: '#10b981'}]}>Rising</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Historical Avg</ThemedText>
            <ThemedText style={styles.dataValue}>6.8m</ThemedText>
          </View>
          
          <View style={styles.chartContainer}>
            <GroundwaterChart variant="dark" />
          </View>
        </ThemedView>
        </View>

        {/* Recharge & Availability */}
        <View onLayout={setOffset('recharge')}>
        <ThemedView style={styles.card}> 
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, {backgroundColor: '#22d3ee15'}]}>
              <MaterialCommunityIcons name="weather-rainy" size={24} color="#22d3ee" />
            </View>
            <ThemedText style={styles.cardTitle}>Recharge & Availability</ThemedText>
          </View>
          <ThemedText style={styles.cardSubtitle}>Water balance and availability metrics</ThemedText>
          
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Rainfall Recharge</ThemedText>
            <ThemedText style={styles.dataValue}>120mm</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Balance</ThemedText>
            <ThemedText style={[styles.dataValue, {color: '#10b981'}]}>+15%</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Per Capita</ThemedText>
            <ThemedText style={styles.dataValue}>1800 m³</ThemedText>
          </View>
          <View style={[styles.dataRow, {borderBottomWidth: 0}]}>
            <ThemedText style={styles.dataLabel}>Availability Index</ThemedText>
            <ThemedText style={[styles.dataValue, {color: '#10b981'}]}>Good</ThemedText>
          </View>
        </ThemedView>
        </View>

        {/* Rainfall & Climate */}
        <View onLayout={setOffset('rainfall')}>
        <ThemedView style={styles.card}> 
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, {backgroundColor: '#f59e4215'}]}>
              <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="#f59e42" />
            </View>
            <ThemedText style={styles.cardTitle}>Rainfall & Climate</ThemedText>
          </View>
          <ThemedText style={styles.cardSubtitle}>Weather patterns and climate data</ThemedText>
          
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Today&apos;s Rainfall</ThemedText>
            <ThemedText style={styles.dataValue}>22mm</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Monsoon Status</ThemedText>
            <ThemedText style={styles.dataValue}>Normal</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Temperature</ThemedText>
            <ThemedText style={styles.dataValue}>32°C</ThemedText>
          </View>

          <View style={styles.chartContainer}>
            <RainfallChart variant="dark" />
          </View>
        </ThemedView>
        </View>

        {/* Quality Card (aligned like others) */}
        <View onLayout={setOffset('quality')}>
        <ThemedView style={styles.card}> 
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, {backgroundColor: '#10b98115'}]}>
              <MaterialCommunityIcons name="water-check" size={20} color="#10b981" />
            </View>
            <ThemedText style={styles.cardTitle}>Quality</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>pH Level</ThemedText>
            <ThemedText style={styles.dataValue}>7.1</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>TDS</ThemedText>
            <ThemedText style={styles.dataValue}>420 mg/L</ThemedText>
          </View>
          <View style={[styles.dataRow, {borderBottomWidth: 0}]}>
            <ThemedText style={styles.dataLabel}>Status</ThemedText>
            <ThemedText style={[styles.dataValue, {color: '#10b981'}]}>Safe</ThemedText>
          </View>
        </ThemedView>
        </View>

        {/* Aquifer & Geological */}
        <View onLayout={setOffset('aquifer')}>
        <ThemedView style={styles.card}> 
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, {backgroundColor: '#a78bfa15'}]}>
              <FontAwesome5 name="mountain" size={20} color="#a78bfa" />
            </View>
            <ThemedText style={styles.cardTitle}>Aquifer & Geological</ThemedText>
          </View>
          <ThemedText style={styles.cardSubtitle}>Underground water structure details</ThemedText>
          
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Aquifer Type</ThemedText>
            <ThemedText style={styles.dataValue}>Alluvial</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Depth</ThemedText>
            <ThemedText style={styles.dataValue}>45m</ThemedText>
          </View>
          <View style={styles.dataRow}>
            <ThemedText style={styles.dataLabel}>Storage Capacity</ThemedText>
            <ThemedText style={styles.dataValue}>High</ThemedText>
          </View>
          <View style={[styles.dataRow, {borderBottomWidth: 0}]}>
            <ThemedText style={styles.dataLabel}>Recharge Zone</ThemedText>
            <ThemedText style={styles.dataValue}>North Block</ThemedText>
          </View>
        </ThemedView>
        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 36,
    overflow: 'visible',
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 72,
    paddingTop: 6,
    marginBottom: 2,
  },
  heroLabel: {
    fontSize: 17,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 4,
  },
  heroChange: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 16,
  },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  heroPillText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  container: {
    minHeight: '100%',
    flexGrow: 1,
    paddingHorizontal: 0,
  },
  header: {
    fontSize: Platform.OS === 'android' ? 26 : 28,
    color: '#2563eb',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    borderRadius: 20,
    paddingHorizontal: 8,
    height: Platform.OS === 'android' ? 40 : 36,
    minWidth: Platform.OS === 'android' ? 140 : 120,
    marginRight: 8,
  },
  searchPlaceholder: {
    color: '#94a3b8',
    fontSize: Platform.OS === 'android' ? 16 : 15,
  },
  profileCircle: {
    width: Platform.OS === 'android' ? 40 : 36,
    height: Platform.OS === 'android' ? 40 : 36,
    borderRadius: Platform.OS === 'android' ? 20 : 18,
    backgroundColor: '#e0e7ef',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: Platform.OS === 'android' ? 12 : 10,
  },
  demoLabel: {
    fontSize: Platform.OS === 'android' ? 16 : 15,
    color: '#334155',
    marginBottom: Platform.OS === 'android' ? 4 : 2,
    lineHeight: Platform.OS === 'android' ? 24 : 20,
  },
  demoValue: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: Platform.OS === 'android' ? 16 : 15,
  },
  // New Groww-inspired styles
  quickStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  statChange: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardContainer: {
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    marginTop: 4,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  dataLabel: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dataValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  chartContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
});
