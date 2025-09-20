import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
    <View style={styles.cardShadow}>
      <ThemedView style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: '#22d3ee15' }]}>
            <MaterialCommunityIcons name="water-plus" size={24} color="#22d3ee" />
          </View>
          <ThemedText style={styles.cardTitle}>Recharge & Availability</ThemedText>
        </View>
        <ThemedText style={styles.cardSubtitle}>
          Last {rechargeData.length} days recharge data
        </ThemedText>

        {/* Recharge Data List */}
        <View style={styles.rechargeList}>
          {displayData.map((item, index) => (
            <View key={index} style={styles.rechargeRow}>
              <View style={styles.dateSection}>
                <View style={styles.rechargeIcon}>
                  <MaterialCommunityIcons 
                    name="water" 
                    size={16} 
                    color="#22d3ee" 
                  />
                </View>
                <ThemedText style={styles.dateLabel}>
                  {formatDate(item.date)}
                </ThemedText>
              </View>
              <View style={styles.rechargeValue}>
                <ThemedText style={[styles.valueText, { color: '#22d3ee' }]}>
                  {item.recharge}
                </ThemedText>
                <ThemedText style={styles.unitText}>{item.unit}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* View More/Less Button */}
        <TouchableOpacity 
          style={styles.viewMoreButton} 
          onPress={handleToggleView}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.viewMoreText}>
            {showAll ? 'View Less' : 'View More'}
          </ThemedText>
          <MaterialCommunityIcons 
            name={showAll ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#22d3ee" 
          />
        </TouchableOpacity>

      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    color: '#ffffff',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#22d3ee',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rechargeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dateLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
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
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22d3ee30',
    marginBottom: 20,
  },
  viewMoreText: {
    color: '#22d3ee',
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