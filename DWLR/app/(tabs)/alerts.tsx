import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, Bell, Info, Shield, Zap } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppNavbar from '@/components/AppNavbar';
import { ThemedText } from '@/components/ThemedText';

const alertsData = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical Water Level Drop',
    message: 'Water level at Mumbai Suburban station has dropped below critical threshold (8.5m)',
    timestamp: '2 minutes ago',
    location: 'Mumbai Suburban - DWLR002',
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: 'warning',
    title: 'High TDS Detected',
    message: 'Total Dissolved Solids level exceeded 500 ppm at Pune Central monitoring station',
    timestamp: '15 minutes ago',
    location: 'Pune Central - DWLR001',
    icon: Shield,
  },
  {
    id: 3,
    type: 'weather',
    title: 'Thunderstorm Alert',
    message: 'Orange alert for thunderstorms in the region. Expected rainfall: 50-100mm',
    timestamp: '1 hour ago',
    location: 'Regional Weather Service',
    icon: Zap,
  },
  {
    id: 4,
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance for monitoring equipment at Nashik Agricultural station',
    timestamp: '3 hours ago',
    location: 'Nashik Agricultural - DWLR003',
    icon: Info,
  },
  {
    id: 5,
    type: 'warning',
    title: 'Extraction Rate High',
    message: 'Water extraction rate 15% above normal for current season',
    timestamp: '6 hours ago',
    location: 'Aurangabad Industrial - DWLR004',
    icon: Bell,
  },
];

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

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
        
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={[styles.iconContainer, { backgroundColor: '#f59e4215' }]}>
              <Bell size={20} color="#f59e42" />
            </View>
            <ThemedText type="title" style={styles.title}>Alerts & Notifications</ThemedText>
          </View>
          <ThemedText style={styles.subtitle}>Real-time system alerts and warnings</ThemedText>
        </Animated.View>

        <View style={styles.content}>
          {alertsData.map((alert, index) => (
            <AlertCard key={alert.id} alert={alert} index={index} />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function AlertCard({ alert, index }: { alert: any; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for critical alerts
    if (alert.type === 'critical') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [alert.type, index, fadeAnim, scaleAnim, pulseAnim]);

  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'critical':
        return { color: '#ef4444', bgColor: '#ef444415', borderColor: '#ef444430' };
      case 'warning':
        return { color: '#f59e0b', bgColor: '#f59e0b15', borderColor: '#f59e0b30' };
      case 'weather':
        return { color: '#8b5cf6', bgColor: '#8b5cf615', borderColor: '#8b5cf630' };
      case 'info':
        return { color: '#06b6d4', bgColor: '#06b6d415', borderColor: '#06b6d430' };
      default:
        return { color: '#64b5f6', bgColor: '#64b5f615', borderColor: '#64b5f630' };
    }
  };

  const config = getAlertConfig(alert.type);
  const Icon = alert.icon;

  return (
    <Animated.View
      style={[
        styles.alertCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: config.borderColor,
        },
      ]}
    >
      <View style={styles.alertHeader}>
        <View style={[styles.alertIconContainer, { backgroundColor: config.bgColor }]}>
          <Icon size={20} color={config.color} />
        </View>
        <View style={styles.alertInfo}>
          <ThemedText style={styles.alertTitle}>{alert.title}</ThemedText>
          <ThemedText style={styles.alertTimestamp}>{alert.timestamp}</ThemedText>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: config.color }]}>
          <Text style={styles.severityText}>{alert.type.toUpperCase()}</Text>
        </View>
      </View>
      
      <ThemedText style={styles.alertMessage}>{alert.message}</ThemedText>
      
      <View style={styles.alertFooter}>
        <ThemedText style={styles.alertLocation}>{alert.location}</ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  alertCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  alertTimestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700',
  },
  alertMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  alertLocation: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
});
