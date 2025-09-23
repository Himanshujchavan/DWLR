import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MonitoringHeader from '@/components/MonitoringHeader';
import QualityMonitor from '@/components/QualityMonitor';
import RechargeMonitor from '@/components/RechargeMonitor';
import WaterLevelMonitor from '@/components/WaterLevelMonitor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
export default function MonitorScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  
  return (
    <>
      {colorScheme === 'light' ? (
        <View style={{ flex: 1, backgroundColor: Colors.light.backgroundSoft }}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
              paddingBottom: (Platform.OS === 'android' ? 100 : 100) + insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
            bounces={Platform.OS === 'ios'}
          >
            <MonitoringHeader />
            <View style={styles.content}>
              <WaterLevelMonitor variant="light" />
              <QualityMonitor variant="light" />
              <RechargeMonitor variant="light" />
            </View>
          </ScrollView>
        </View>
      ) : (
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f172a']}
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
            <MonitoringHeader />
            <View style={styles.content}>
              <WaterLevelMonitor variant="dark" />
              <QualityMonitor variant="dark" />
              <RechargeMonitor variant="dark" />
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
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
    color: '#ffffff',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});
