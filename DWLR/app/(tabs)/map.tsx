import {
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppNavbar from '@/components/AppNavbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface MapMarker {
  id: string;
  type: 'water-level' | 'quality' | 'rainfall' | 'recharge';
  name: string;
  coordinates: { x: number; y: number };
  value: string;
  status: 'good' | 'warning' | 'critical';
  details: {
    level?: string;
    quality?: string;
    rainfall?: string;
    lastUpdate: string;
  };
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilters, setActiveFilters] = useState<string[]>(['water-level', 'quality', 'rainfall', 'recharge']);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Sample marker data
  const markers: MapMarker[] = [
    {
      id: '1',
      type: 'water-level',
      name: 'Station A-101',
      coordinates: { x: 120, y: 180 },
      value: '7.2m',
      status: 'good',
      details: { level: '7.2m (Safe)', lastUpdate: '2 min ago' }
    },
    {
      id: '2',
      type: 'quality',
      name: 'Quality Point B-52',
      coordinates: { x: 220, y: 250 },
      value: 'pH 7.1',
      status: 'good',
      details: { quality: 'pH 7.1, TDS 420mg/L', lastUpdate: '5 min ago' }
    },
    {
      id: '3',
      type: 'rainfall',
      name: 'Rain Gauge C-33',
      coordinates: { x: 180, y: 320 },
      value: '22mm',
      status: 'warning',
      details: { rainfall: '22mm today', lastUpdate: '1 min ago' }
    },
    {
      id: '4',
      type: 'recharge',
      name: 'Recharge Zone D-15',
      coordinates: { x: 280, y: 200 },
      value: '+15%',
      status: 'good',
      details: { level: 'Recharge +15%', lastUpdate: '10 min ago' }
    },
    {
      id: '5',
      type: 'water-level',
      name: 'Station E-207',
      coordinates: { x: 160, y: 140 },
      value: '5.8m',
      status: 'warning',
      details: { level: '5.8m (Low)', lastUpdate: '3 min ago' }
    }
  ];

  const filterOptions = [
    { key: 'water-level', label: 'Water Level', icon: 'water', color: '#2563eb' },
    { key: 'quality', label: 'Quality', icon: 'water-check', color: '#10b981' },
    { key: 'rainfall', label: 'Rainfall', icon: 'weather-rainy', color: '#f59e42' },
    { key: 'recharge', label: 'Recharge', icon: 'arrow-up-circle', color: '#22d3ee' }
  ];

  const toggleFilter = (filterKey: string) => {
    setActiveFilters(prev => 
      prev.includes(filterKey) 
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const getMarkerColor = (marker: MapMarker) => {
    const colors = {
      'water-level': '#2563eb',
      'quality': '#10b981',
      'rainfall': '#f59e42',
      'recharge': '#22d3ee'
    };
    return colors[marker.type];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e42';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredMarkers = markers.filter(marker => activeFilters.includes(marker.type));

  return (
    <LinearGradient
      colors={['#1a237e', '#283593', '#3949ab']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container,
          { paddingBottom: Platform.OS === 'android' ? 100 + insets.bottom : 100 }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
      >
        <AppNavbar />

        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Maps & GIS</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Real-time groundwater monitoring stations</ThemedText>
        </View>

        {/* Filter Controls */}
        <View style={styles.filtersContainer}>
          <ThemedText style={styles.filtersTitle}>Map Layers</ThemedText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  activeFilters.includes(filter.key) && styles.filterChipActive
                ]}
                onPress={() => toggleFilter(filter.key)}
              >
                <MaterialCommunityIcons 
                  name={filter.icon as any} 
                  size={16} 
                  color={activeFilters.includes(filter.key) ? '#ffffff' : filter.color} 
                />
                <ThemedText style={[
                  styles.filterChipText,
                  activeFilters.includes(filter.key) && styles.filterChipTextActive
                ]}>
                  {filter.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Map Container */}
        <ThemedView style={styles.mapCard}>
          <View style={styles.mapContainer}>
            {/* Map Background */}
            <View style={styles.mapBackground}>
              <View style={styles.gridOverlay} />
              
              {/* Sample Geographic Features */}
              <View style={[styles.river, { top: 100, left: 50, width: 200 }]} />
              <View style={[styles.river, { top: 280, left: 120, width: 150 }]} />
              <View style={[styles.area, { top: 160, left: 240, width: 80, height: 60 }]} />
              
              {/* Markers */}
              {filteredMarkers.map((marker) => (
                <TouchableOpacity
                  key={marker.id}
                  style={[
                    styles.marker,
                    { 
                      top: marker.coordinates.y, 
                      left: marker.coordinates.x,
                      backgroundColor: getMarkerColor(marker),
                      borderColor: getStatusColor(marker.status)
                    }
                  ]}
                  onPress={() => setSelectedMarker(marker)}
                >
                  <MaterialCommunityIcons 
                    name={filterOptions.find(f => f.key === marker.type)?.icon as any} 
                    size={12} 
                    color="#ffffff" 
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Map Legend */}
            <View style={styles.mapLegend}>
              <ThemedText style={styles.legendTitle}>Legend</ThemedText>
              {filterOptions.filter(f => activeFilters.includes(f.key)).map((filter) => (
                <View key={filter.key} style={styles.legendItem}>
                  <View style={[styles.legendIcon, { backgroundColor: filter.color }]}>
                    <MaterialCommunityIcons name={filter.icon as any} size={10} color="#ffffff" />
                  </View>
                  <ThemedText style={styles.legendText}>{filter.label}</ThemedText>
                </View>
              ))}
            </View>

            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="add" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="remove" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="locate" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>

        {/* Station Info Card */}
        {selectedMarker && (
          <ThemedView style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <View style={[styles.infoIcon, { backgroundColor: `${getMarkerColor(selectedMarker)}20` }]}>
                  <MaterialCommunityIcons 
                    name={filterOptions.find(f => f.key === selectedMarker.type)?.icon as any} 
                    size={20} 
                    color={getMarkerColor(selectedMarker)} 
                  />
                </View>
                <View style={styles.infoTitleContainer}>
                  <ThemedText style={styles.infoTitle}>{selectedMarker.name}</ThemedText>
                  <ThemedText style={styles.infoSubtitle}>
                    {filterOptions.find(f => f.key === selectedMarker.type)?.label}
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedMarker(null)}
              >
                <Ionicons name="close" size={20} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Current Value</ThemedText>
                <ThemedText style={[styles.infoValue, { color: getStatusColor(selectedMarker.status) }]}>
                  {selectedMarker.value}
                </ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Status</ThemedText>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedMarker.status)}20` }]}>
                  <ThemedText style={[styles.statusText, { color: getStatusColor(selectedMarker.status) }]}>
                    {selectedMarker.status.charAt(0).toUpperCase() + selectedMarker.status.slice(1)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Last Update</ThemedText>
                <ThemedText style={styles.infoValue}>{selectedMarker.details.lastUpdate}</ThemedText>
              </View>
            </View>
          </ThemedView>
        )}

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <ThemedText style={styles.statsTitle}>Active Stations</ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{markers.filter(m => m.type === 'water-level').length}</ThemedText>
              <ThemedText style={styles.statLabel}>Water Level</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{markers.filter(m => m.type === 'quality').length}</ThemedText>
              <ThemedText style={styles.statLabel}>Quality</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{markers.filter(m => m.type === 'rainfall').length}</ThemedText>
              <ThemedText style={styles.statLabel}>Rainfall</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{markers.filter(m => m.type === 'recharge').length}</ThemedText>
              <ThemedText style={styles.statLabel}>Recharge</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    flexGrow: 1,
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  filtersScroll: {
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  filterChipText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  mapCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    margin: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  mapContainer: {
    height: 400,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    opacity: 0.3,
  },
  river: {
    position: 'absolute',
    height: 8,
    backgroundColor: '#60a5fa',
    borderRadius: 4,
    opacity: 0.6,
  },
  area: {
    position: 'absolute',
    backgroundColor: '#34d399',
    borderRadius: 8,
    opacity: 0.3,
  },
  marker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mapLegend: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTitleContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  infoSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoContent: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  infoLabel: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
