import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ModernCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: string;
  iconFamily?: 'FontAwesome5' | 'MaterialCommunityIcons';
  status?: 'low' | 'medium' | 'high';
  subtitle?: string;
}

export function ModernCard({ 
  title, 
  value, 
  unit, 
  icon, 
  iconFamily = 'FontAwesome5',
  status,
  subtitle 
}: ModernCardProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    background: colorScheme === 'light' ? Colors.light.cardBackground : '#16213e',
    border: colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.1)',
    text: colorScheme === 'light' ? Colors.light.text : '#ffffff',
    textSecondary: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)',
    primary: colorScheme === 'light' ? Colors.light.primary : '#64b5f6',
    iconBg: colorScheme === 'light' ? Colors.light.primary + '15' : 'rgba(100, 181, 246, 0.15)',
  };

  const statusColor = status ? {
    low: colorScheme === 'light' ? Colors.light.statusLow : '#ff4444',
    medium: colorScheme === 'light' ? Colors.light.statusMedium : '#ff8800',
    high: colorScheme === 'light' ? Colors.light.statusHigh : '#44aa44',
  }[status] : colors.primary;

  const IconComponent = iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons : FontAwesome5;

  return (
    <View style={[
      styles.card,
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
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
          <IconComponent name={icon as any} size={24} color={colors.primary} />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      </View>
      
      {subtitle && (
        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: status ? statusColor : colors.text }]}>
          {value}
          {unit && <Text style={[styles.unit, { color: colors.textSecondary }]}> {unit}</Text>}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  valueContainer: {
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
  },
});