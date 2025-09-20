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
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(22, 33, 62, 0.6)',
    marginBottom: 20,
    minHeight: 140,
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f59e42',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pillText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
});
