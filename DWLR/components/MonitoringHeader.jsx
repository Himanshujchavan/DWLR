import { Activity, Droplets, FlaskConical, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MonitoringHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Activity size={18} color="#64b5f6" />
        <Text style={styles.title}>Real Time Monitoring</Text>
      </View>
      <View style={styles.iconRow}>
        <View style={[styles.pill, { backgroundColor: '#2563eb15' }]}>
          <Droplets size={14} color="#64b5f6" />
          <Text style={styles.pillText}>Groundwater</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: '#10b98115' }]}>
          <FlaskConical size={14} color="#64b5f6" />
          <Text style={styles.pillText}>Quality</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: '#22d3ee15' }]}>
          <TrendingUp size={14} color="#64b5f6" />
          <Text style={styles.pillText}>Recharge</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
});
