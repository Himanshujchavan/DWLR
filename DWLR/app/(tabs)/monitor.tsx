import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppNavbar from '@/components/AppNavbar';
import MonitoringHeader from '@/components/MonitoringHeader';
import QualityMonitor from '@/components/QualityMonitor';
import RechargeMonitor from '@/components/RechargeMonitor';
import WaterLevelMonitor from '@/components/WaterLevelMonitor';
export default function MonitorScreen() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['#1a237e', '#283593', '#3949ab']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: (Platform.OS === 'android' ? 100 : 100) + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
      >
        <AppNavbar />
        <MonitoringHeader />
        <View style={styles.content}>
          <WaterLevelMonitor variant="dark" />
          <QualityMonitor variant="dark" />
          <RechargeMonitor variant="dark" />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
  },
});
