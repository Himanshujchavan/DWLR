import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Activity, Droplets, FlaskConical, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MonitoringHeader() {
  const colorScheme = useColorScheme();
  
  const colors = {
    background: colorScheme === 'light' ? Colors.light.cardBackground : 'rgba(22, 33, 62, 0.6)',
    border: colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.1)',
    text: colorScheme === 'light' ? Colors.light.text : '#ffffff',
    textSecondary: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)',
    primary: colorScheme === 'light' ? Colors.light.primary : '#64b5f6',
    secondary: colorScheme === 'light' ? Colors.light.secondary : '#22d3ee',
    pillText: colorScheme === 'light' ? Colors.light.primary : '#ffffff',
  };

  const pillData = [
    {
      icon: Droplets,
      text: 'Groundwater',
      bgColor: colorScheme === 'light' ? Colors.light.primary + '15' : '#2563eb15',
      textColor: colors.pillText,
    },
    {
      icon: FlaskConical,
      text: 'Quality',
      bgColor: colorScheme === 'light' ? Colors.light.secondary + '15' : '#10b98115',
      textColor: colors.pillText,
    },
    {
      icon: TrendingUp,
      text: 'Recharge',
      bgColor: colorScheme === 'light' ? Colors.light.statusHigh + '15' : '#22d3ee15',
      textColor: colors.pillText,
    },
  ];

  return (
    <View style={[
      styles.header,
      {
        backgroundColor: colors.background,
        borderColor: colors.border,
        // Enhanced shadow for light mode
        ...(colorScheme === 'light' ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        } : {
          shadowOpacity: 0,
          elevation: 0,
        })
      }
    ]}>
      <View style={styles.titleRow}>
        <Activity size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Real Time Monitoring</Text>
      </View>
      <View style={styles.iconRow}>
        {pillData.map((pill, index) => (
          <View key={index} style={[styles.pill, { 
            backgroundColor: pill.bgColor,
            borderColor: colors.border,
          }]}>
            <pill.icon size={16} color={colors.primary} />
            <Text style={[styles.pillText, { color: pill.textColor }]}>{pill.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    minHeight: 120,
    borderRadius: 20,
    marginHorizontal: 16,
    borderWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    minWidth: 100,
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
