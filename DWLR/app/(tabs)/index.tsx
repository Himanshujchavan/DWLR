import AppNavbar from '@/components/AppNavbar';
import GroundwaterChart from '@/components/GroundwaterChart';
import RainfallChart from '@/components/RainfallChart';
import RechargeAvailabilityCard from '@/components/RechargeAvailabilityCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import WaterLevelIcon from '@/components/WaterLevelIcon';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const setOffset = (section: string) => () => {
    // Placeholder for offset handling if needed
    console.log(`Setting offset for ${section}`);
  };

  const parameterIcons = [
    { 
      icon: 'weather-rainy', 
      color: '#3b82f6', 
      bg: '#3b82f615',
      name: 'Rainfall'
    },
    { 
      icon: 'arrow-down', 
      color: '#06b6d4', 
      bg: '#06b6d415',
      name: 'Depth'
    },
    { 
      icon: 'layers', 
      color: '#84cc16', 
      bg: '#84cc1615',
      name: 'Soil'
    },
    { 
      icon: 'water-pump', 
      color: '#f59e0b', 
      bg: '#f59e0b15',
      name: 'Usage'
    },
  ];

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <AppNavbar />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // Ensure content clears the Android tab bar
          paddingBottom: (Platform.OS === 'android' ? 100 : 60) + insets.bottom,
        }}
        bounces={Platform.OS === 'ios'}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <WaterLevelIcon size={90} isPositive={true} />
          <ThemedText style={styles.heroValue}>7.8 M</ThemedText>
          <ThemedText style={styles.heroLabel}>Water Level</ThemedText>
          <ThemedText style={[styles.heroChange, {color: '#10b981'}]}>+0.3m (4.3%)</ThemedText>
          <View style={styles.heroPill}>
            <ThemedText style={styles.heroPillText}>Orange Alert for Thunderstorms</ThemedText>
          </View>
        </View>

      {/* Main Content Cards */}
      <View style={styles.cardContainer}>
        {/* Core Groundwater Data */}
        <View onLayout={setOffset('core')} style={styles.cardShadow}>
          <ThemedView style={styles.card}> 
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, {backgroundColor: '#2563eb15'}]}>
                <Ionicons name="water" size={24} color="#2563eb" />
              </View>
              <ThemedText style={styles.cardTitle}> Groundwater Level</ThemedText>
            </View>
                   
             
            <View style={styles.chartContainer}>
              <GroundwaterChart variant="dark" />
            </View>
          </ThemedView>
        </View>
           <View onLayout={setOffset('recharge')}>
          <RechargeAvailabilityCard />
        </View>
        {/* Rainfall & Climate */}
        <View onLayout={setOffset('rainfall')} style={styles.cardShadow}>
          <ThemedView style={styles.card}> 
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, {backgroundColor: '#f59e4215'}]}>
                <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="#f59e42" />
              </View>
              <ThemedText style={styles.cardTitle}>Rainfall & Climate</ThemedText>
            </View>
            <ThemedText style={styles.cardSubtitle}>Weather patterns and climate data</ThemedText>
            
            <View style={styles.dataRow}>
              <ThemedText style={styles.dataLabel}>Today&apos;s Rainfall</ThemedText>
              <ThemedText style={styles.dataValue}>22mm</ThemedText>
            </View>
            <View style={styles.dataRow}>
              <ThemedText style={styles.dataLabel}>Humidity</ThemedText>
              <ThemedText style={styles.dataValue}>48%</ThemedText>
            </View>
            <View style={styles.dataRow}>
              <ThemedText style={styles.dataLabel}>Temperature</ThemedText>
              <ThemedText style={styles.dataValue}>32°C</ThemedText>
            </View>

            <View style={styles.chartContainer}>
              <RainfallChart variant="dark" />
            </View>
          </ThemedView>
        </View>
        {/* Enhanced Recharge & Availability Card */}
       

        {/* Parameter Icons Section */}
        <View onLayout={setOffset('parameters')} style={styles.cardShadow}>
          <ThemedView style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#8b5cf615' }]}>
                <MaterialCommunityIcons name="view-dashboard" size={24} color="#8b5cf6" />
              </View>
              <ThemedText style={styles.cardTitle}>Parameters</ThemedText>
            </View>
            <ThemedText style={styles.cardSubtitle}>Key monitoring parameters</ThemedText>
            
            <View style={styles.parameterRowInline}>
              {parameterIcons.map((param, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.parameterInlineItem}
                  activeOpacity={0.7}
                >
                  <View style={[styles.parameterInlineIcon, { backgroundColor: param.bg }]}>
                    <MaterialCommunityIcons
                      name={param.icon as any}
                      size={22}
                      color={param.color}
                    />
                  </View>
                  <ThemedText style={styles.parameterInlineName}>{param.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 20,
    backgroundColor: '#16213e',
    marginBottom: 20,
    minHeight: 320,
  },
  heroValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 56,
  },
  heroLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  heroChange: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  heroPill: {
    backgroundColor: '#f59e42',
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
    paddingBottom: 20,
  },
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
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dataLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  chartContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  parameterRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  parameterInlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '48%',
    marginBottom: 10,
  },
  parameterInlineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  parameterInlineName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
});
