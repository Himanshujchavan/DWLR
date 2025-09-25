import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const alertsData = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical Water Level Drop',
    message: 'Water level at Mumbai Suburban station has dropped below critical threshold (8.5m)',
    timestamp: '2 minutes ago',
    location: 'Mumbai Suburban - DWLR001',
  },
  {
    id: 2,
    type: 'warning',
    title: 'High TDS Detected',
    message: 'Total Dissolved Solids level exceeded 500 ppm at Pune Central monitoring station',
    timestamp: '15 minutes ago',
    location: 'Mumbai Suburban - DWLR001',
  },
  {
    id: 3,
    type: 'weather',
    title: 'Thunderstorm Alert',
    message: 'Orange alert for thunderstorms in the region. Expected rainfall: 50-100mm',
    timestamp: '1 hour ago',
    location: 'Mumbai Suburban - DWLR001',
  },
  {
    id: 4,
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance for monitoring equipment at Nashik Agricultural station',
    timestamp: '3 hours ago',
    location: 'Mumbai Suburban - DWLR001',
  },
  {
    id: 5,
    type: 'warning',
    title: 'Extraction Rate High',
    message: 'Water extraction rate 15% above normal for current season',
    timestamp: '6 hours ago',
    location: 'Mumbai Suburban - DWLR001',
  },
];

export default function AlertsScreen() {
  const colorScheme = useColorScheme();

  // Dynamic colors based on theme
  const containerBg = colorScheme === 'light' ? Colors.light.background : '#1a1a2e';
  const heroBg = colorScheme === 'light' ? Colors.light.backgroundSoft : '#16213e';
  const heroValueColor = colorScheme === 'light' ? Colors.light.text : '#ffffff';
  const heroPillBg = colorScheme === 'light' ? Colors.light.primary : '#f59e42';

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: heroBg }]}>
          <ThemedText style={[styles.heroValue, { color: heroValueColor }]}>Active Alerts</ThemedText>
    
          <ThemedText style={[styles.heroChange, {color: '#ef4444'}]}>2 Critical</ThemedText>
          <View style={[styles.heroPill, { backgroundColor: heroPillBg }]}>
            <ThemedText style={styles.heroPillText}>Real-time Alert Monitoring</ThemedText>
          </View>
        </View>

        {/* Main Content Cards */}
        <View style={styles.cardContainer}>
          {alertsData.map((alert, index) => (
            <AlertCard key={alert.id} alert={alert} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function AlertCard({ alert, index }: { alert: any; index: number }) {
  const colorScheme = useColorScheme();

  const getAlertConfig = (type: string) => {
    const lightColors = {
      critical: { color: Colors.light.statusLow, bgColor: Colors.light.statusLow + '15', borderColor: Colors.light.statusLow + '30' },
      warning: { color: Colors.light.statusMedium, bgColor: Colors.light.statusMedium + '15', borderColor: Colors.light.statusMedium + '30' },
      weather: { color: '#8b5cf6', bgColor: '#8b5cf615', borderColor: '#8b5cf630' },
      info: { color: Colors.light.secondary, bgColor: Colors.light.secondary + '15', borderColor: Colors.light.secondary + '30' },
      default: { color: Colors.light.primary, bgColor: Colors.light.primary + '15', borderColor: Colors.light.primary + '30' }
    };
    
    const darkColors = {
      critical: { color: '#ef4444', bgColor: '#ef444415', borderColor: '#ef444430' },
      warning: { color: '#f59e0b', bgColor: '#f59e0b15', borderColor: '#f59e0b30' },
      weather: { color: '#8b5cf6', bgColor: '#8b5cf615', borderColor: '#8b5cf630' },
      info: { color: '#06b6d4', bgColor: '#06b6d415', borderColor: '#06b6d430' },
      default: { color: '#64b5f6', bgColor: '#64b5f615', borderColor: '#64b5f630' }
    };

    const colors = colorScheme === 'light' ? lightColors : darkColors;
    return colors[type as keyof typeof colors] || colors.default;
  };

  const config = getAlertConfig(alert.type);

  return (
    <View style={styles.cardShadow}>
      <ThemedView style={[
        styles.card,
        {
          backgroundColor: colorScheme === 'light' ? Colors.light.cardBackground : '#16213e',
          borderColor: colorScheme === 'light' ? '#9ca3af' : '#374151',
        }
      ]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.cardTitle} numberOfLines={2}>{alert.title}</ThemedText>
          </View>
          <View style={[styles.severityBadge, { backgroundColor: config.color }]}>
            <Text style={styles.severityText}>{alert.type.toUpperCase()}</Text>
          </View>
        </View>
        
        <ThemedText style={[styles.cardSubtitle, {
          color: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)'
        }]}>{alert.timestamp}</ThemedText>
        
        <View style={styles.contentSection}>
          <View style={[styles.dataRowColumn, {
            borderBottomColor: colorScheme === 'light' ? '#9ca3af' : '#374151'
          }]}>
            <ThemedText style={[styles.dataLabel, {
              color: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.8)'
            }]}>Location</ThemedText>
            <ThemedText style={[styles.dataValueWrapped, {
              color: colorScheme === 'light' ? Colors.light.text : '#ffffff'
            }]} numberOfLines={2}>{alert.location}</ThemedText>
          </View>
          
          <View style={styles.messageSection}>
            <ThemedText style={[styles.dataLabel, {
              color: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.8)'
            }]}>Message</ThemedText>
            <ThemedText style={[styles.alertMessage, {
              color: colorScheme === 'light' ? Colors.light.text : 'rgba(255, 255, 255, 0.85)'
            }]}>{alert.message}</ThemedText>
          </View>
        </View>
        
        <View style={[styles.actionSection, {
          borderTopColor: colorScheme === 'light' ? '#9ca3af' : '#374151'
        }]}>
          <TouchableOpacity 
            style={[styles.deepDiveButton, {
              backgroundColor: colorScheme === 'light' ? Colors.light.primary : '#3b82f6',
              borderColor: colorScheme === 'light' ? Colors.light.primary : '#3b82f6'
            }]}
            onPress={() => console.log(`Deep dive for alert: ${alert.id}`)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.deepDiveText}>Deep Dive</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor now set dynamically
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    // backgroundColor now set dynamically
    marginBottom: 20,
    minHeight: 220,
  },
  heroValue: {
    fontSize: 48,
    fontWeight: 'bold',
    // color now set dynamically
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 56,
  },
  heroLabel: {
    fontSize: 18,
    // color handled by ThemedText
    marginBottom: 12,
  },
  heroChange: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  heroPill: {
    // backgroundColor now set dynamically
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
    paddingBottom: 100, // Increased to account for tab bar
  },
  cardShadow: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    // Dynamic styling applied inline based on theme
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    minHeight: 40,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
    paddingRight: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    // color handled by ThemedText
    lineHeight: 21,
    flexShrink: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    // color now set dynamically
    marginBottom: 16,
  },
  contentSection: {
    marginBottom: 20,
  },
  messageSection: {
    marginTop: 12,
  },
  actionSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor now set dynamically
  },
  dataRowColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    // borderBottomColor now set dynamically
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '500',
    // color now set dynamically
    marginBottom: 6,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    // color now set dynamically
  },
  dataValueWrapped: {
    fontSize: 14,
    fontWeight: '500',
    // color now set dynamically
    lineHeight: 18,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  severityText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  alertMessage: {
    fontSize: 14,
    // color now set dynamically
    lineHeight: 20,
    marginTop: 8,
  },
  deepDiveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  deepDiveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
