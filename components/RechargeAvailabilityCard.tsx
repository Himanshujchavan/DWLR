import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface RechargeData {
  date: string;
  recharge: number;
  unit: string;
}

const RechargeAvailabilityCard: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const colorScheme = useColorScheme();

  const colors = {
    cardBackground: colorScheme === 'light' ? Colors.light.cardBackground : '#16213e',
    cardBorder: colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.1)',
    text: colorScheme === 'light' ? Colors.light.text : '#ffffff',
    textSecondary: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)',
    textMuted: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.6)',
    primary: colorScheme === 'light' ? Colors.light.secondary : '#22d3ee',
    rowBackground: colorScheme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)',
    buttonBackground: colorScheme === 'light' ? Colors.light.secondary + '10' : 'rgba(34, 211, 238, 0.1)',
    buttonBorder: colorScheme === 'light' ? Colors.light.secondary + '30' : '#22d3ee30',
    iconBackground: colorScheme === 'light' ? Colors.light.secondary + '15' : '#22d3ee15',
    borderColor: colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.1)',
  };

  // Sample recharge data for last 15 days
  const rechargeData: RechargeData[] = [
    { date: '2025-09-17', recharge: 12.5, unit: 'mm' },
    { date: '2025-09-16', recharge: 8.2, unit: 'mm' },
    { date: '2025-09-15', recharge: 15.7, unit: 'mm' },
    { date: '2025-09-14', recharge: 22.1, unit: 'mm' },
    { date: '2025-09-13', recharge: 18.3, unit: 'mm' },
    { date: '2025-09-12', recharge: 9.8, unit: 'mm' },
    { date: '2025-09-11', recharge: 25.4, unit: 'mm' },
    { date: '2025-09-10', recharge: 14.6, unit: 'mm' },
    { date: '2025-09-09', recharge: 11.2, unit: 'mm' },
    { date: '2025-09-08', recharge: 16.9, unit: 'mm' },
    { date: '2025-09-07', recharge: 7.3, unit: 'mm' },
    { date: '2025-09-06', recharge: 19.5, unit: 'mm' },
    { date: '2025-09-05', recharge: 13.8, unit: 'mm' },
    { date: '2025-09-04', recharge: 21.7, unit: 'mm' },
    { date: '2025-09-03', recharge: 10.4, unit: 'mm' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleToggleView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAll(!showAll);
  };

  const displayData = showAll ? rechargeData : rechargeData.slice(0, 8);

  return (
    <View style={[
      styles.cardShadow,
      colorScheme === 'light' ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      } : {}
    ]}>
      <ThemedView style={[styles.card, {
        backgroundColor: colors.cardBackground,
        borderColor: colors.cardBorder,
      }]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
            <MaterialCommunityIcons name="water-plus" size={24} color={colors.primary} />
          </View>
          <ThemedText style={[styles.cardTitle, { color: colors.text }]}>Recharge </ThemedText>
        </View>
        <ThemedText style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
          Last {rechargeData.length} days recharge data
        </ThemedText>

        {/* Recharge Data List */}
        <View style={styles.rechargeList}>
          {displayData.map((item, index) => (
            <View key={index} style={[styles.rechargeRow, {
              backgroundColor: colors.rowBackground,
              borderLeftColor: colors.primary,
            }]}>
              <View style={styles.dateSection}>
                <View style={[styles.rechargeIcon, { backgroundColor: colors.iconBackground }]}>
                  <MaterialCommunityIcons 
                    name="water" 
                    size={16} 
                    color={colors.primary} 
                  />
                </View>
                <ThemedText style={[styles.dateLabel, { color: colors.textSecondary }]}>
                  {formatDate(item.date)}
                </ThemedText>
              </View>
              <View style={styles.rechargeValue}>
                <ThemedText style={[styles.valueText, { color: colors.primary }]}>
                  {item.recharge}
                </ThemedText>
                <ThemedText style={[styles.unitText, { color: colors.textMuted }]}>{item.unit}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* View More/Less Button */}
        <TouchableOpacity 
          style={[styles.viewMoreButton, {
            backgroundColor: colors.buttonBackground,
            borderColor: colors.buttonBorder,
          }]} 
          onPress={handleToggleView}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.viewMoreText, { color: colors.primary }]}>
            {showAll ? 'View Less' : 'View More'}
          </ThemedText>
          <MaterialCommunityIcons 
            name={showAll ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={colors.primary} 
          />
        </TouchableOpacity>

      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
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
  rechargeList: {
    marginBottom: 16,
  },
  rechargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rechargeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  rechargeValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unitText: {
    fontSize: 12,
    marginLeft: 4,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  summarySection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RechargeAvailabilityCard;