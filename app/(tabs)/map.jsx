import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import DWLRStationPopup, { STATIONS as IMPORTED_STATIONS, getStationById } from '../../components/DWLRStationPopup';

const { width: screenWidth } = Dimensions.get('window');

export default function MapScreen() {
  // All hooks declared at the top
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedStationData, setSelectedStationData] = useState(null);
  const [waterFilter, setWaterFilter] = useState('all');
  const [rainfallFilter, setRainfallFilter] = useState('all');
  const [aquiferFilter, setAquiferFilter] = useState('all');

  const dwlrPopupRef = useRef(null);
  const mapRef = useRef(null);

  // Responsive sizing based on screen width
  const isSmallScreen = screenWidth < 380;
  const buttonFontSize = isSmallScreen ? 10 : 12;
  const buttonIconSize = isSmallScreen ? 16 : 18;
  const controlPanelPadding = isSmallScreen ? 12 : 16;
  const buttonMinHeight = isSmallScreen ? 40 : 44;

  // Handler functions with haptic feedback
  const handleFilterPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowFilterPanel(!showFilterPanel);
  }, [showFilterPanel]);

  const handleStatisticsPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowStatistics(!showStatistics);
  }, [showStatistics]);

  const handleLegendPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLegend(!showLegend);
  }, [showLegend]);

  // Use static stations directly - NO DUPLICATION
  const stations = useMemo(() => {
    console.log('Loading IMPORTED_STATIONS:', IMPORTED_STATIONS.length, 'stations');
    return IMPORTED_STATIONS.map(s => ({
      ...s,
      lat: s.coordinates.lat,
      long: s.coordinates.lng,
      waterLevel: s.groundwater.currentLevel,
      name: s.name,
      id: s.id
    }));
  }, []);

  // Water level categorization
  const waterLevelCategory = useCallback((level) => {
    if (level < 2) return 'low';
    if (level < 5) return 'moderate';
    return 'high';
  }, []);

  // Rainfall categorization
  const rainfallCategory = useCallback((monthlyRainfall) => {
    if (monthlyRainfall < 50) return 'low';
    if (monthlyRainfall < 150) return 'moderate';
    return 'high';
  }, []);

  // Aquifer quality categorization
  const aquiferCategory = useCallback((quality) => {
    if (quality === 'Excellent') return 'excellent';
    if (quality === 'Good') return 'good';
    if (quality === 'Moderate') return 'moderate';
    return 'poor';
  }, []);

  // Filter stations based on multiple criteria
  const filteredStations = useMemo(() => {
    if (!stations || !Array.isArray(stations)) return [];
    
    let filtered = stations;
    
    // Water level filter
    if (waterFilter !== 'all') {
      filtered = filtered.filter(s => s && waterLevelCategory(s.waterLevel) === waterFilter);
    }

    // Rainfall filter (using mock data from station)
    if (rainfallFilter !== 'all') {
      filtered = filtered.filter(s => {
        const stationData = getStationById(s.id);
        if (!stationData?.rainfall) return true;
        return rainfallCategory(stationData.rainfall.thisMonth) === rainfallFilter;
      });
    }

    // Aquifer filter
    if (aquiferFilter !== 'all') {
      filtered = filtered.filter(s => {
        const stationData = getStationById(s.id);
        if (!stationData?.aquifer) return true;
        return aquiferCategory(stationData.aquifer.qualityIndex) === aquiferFilter;
      });
    }
    
    return filtered;
  }, [stations, waterFilter, rainfallFilter, aquiferFilter, waterLevelCategory, rainfallCategory, aquiferCategory]);

  // Calculate statistics for filtered stations
  const statistics = useMemo(() => {
    if (!filteredStations.length) return null;

    const levels = filteredStations.map(s => s.waterLevel).filter(Boolean);
    const avgLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length;
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);

    // Get detailed data for rainfall and aquifer stats
    const stationDetails = filteredStations.map(s => getStationById(s.id)).filter(Boolean);
    
    const rainfallData = stationDetails.map(s => s.rainfall?.thisMonth || 0);
    const avgRainfall = rainfallData.reduce((sum, rain) => sum + rain, 0) / rainfallData.length;

    const qualityCount = stationDetails.reduce((acc, s) => {
      const quality = s.aquifer?.qualityIndex || 'Unknown';
      acc[quality] = (acc[quality] || 0) + 1;
      return acc;
    }, {});

    return {
      totalStations: filteredStations.length,
      avgWaterLevel: parseFloat(avgLevel.toFixed(1)),
      minWaterLevel: minLevel,
      maxWaterLevel: maxLevel,
      avgRainfall: parseFloat(avgRainfall.toFixed(1)),
      qualityDistribution: qualityCount,
      safeStations: stationDetails.filter(s => s.groundwater?.status === 'safe').length,
      criticalStations: stationDetails.filter(s => s.groundwater?.status === 'critical').length,
    };
  }, [filteredStations]);

  // Marker color based on water level
  const getMarkerColor = useCallback((waterLevel) => {
    const category = waterLevelCategory(waterLevel);
    switch (category) {
      case 'low': return '#ff4444';
      case 'moderate': return '#ff8800'; 
      case 'high': return '#44aa44';
      default: return '#666666';
    }
  }, [waterLevelCategory]);

  // Render individual station marker
  const renderStation = useCallback((station) => {
    if (!station || typeof station.lat !== 'number' || typeof station.long !== 'number') {
      return null;
    }
    
    const isSelected = selectedStation?.id === station.id;
    
    const handleMarkerPress = () => {
      console.log('🗺️ Marker pressed:', station.name);
      
      // Get full station data
      const fullStationData = getStationById(station.id);
      console.log('📊 Station data found:', !!fullStationData);
      
      if (fullStationData) {
        setSelectedStationData(fullStationData);
        setSelectedStation(station);
        console.log('📍 State updated, station data set');
        
        // Focus map on station
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: station.lat,
            longitude: station.long,
            latitudeDelta: 0.8,
            longitudeDelta: 0.8,
          }, 800);
        }
        
        console.log('✅ Station selected:', station.name, 'Popup should auto-show');
      }
    };

    return (
      <Marker
        key={station.id}
        coordinate={{ latitude: station.lat, longitude: station.long }}
        onPress={handleMarkerPress}
      >
        <View style={[
          styles.customMarker,
          { backgroundColor: getMarkerColor(station.waterLevel) },
          isSelected && styles.selectedMarker
        ]}>
          <Ionicons name="water" size={12} color="white" />
        </View>
      </Marker>
    );
  }, [selectedStation, getMarkerColor]);

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text style={styles.webFallbackTitle}>Map Feature</Text>
        <Text style={styles.webFallbackText}>
          Interactive DWLR station map is available on mobile devices only.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.controlPanel, { paddingHorizontal: controlPanelPadding }]}>
        <TouchableOpacity 
          style={[styles.controlButton, showFilterPanel && styles.controlButtonActive, { minHeight: buttonMinHeight }]}
          onPress={handleFilterPress}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={buttonIconSize} color={showFilterPanel ? "#fff" : "#64748b"} />
          <Text style={[styles.controlButtonText, showFilterPanel && styles.controlButtonTextActive, { fontSize: buttonFontSize }]} numberOfLines={1}>
            Filters ({filteredStations.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, showStatistics && styles.controlButtonActive, { minHeight: buttonMinHeight }]}
          onPress={handleStatisticsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="stats-chart-outline" size={buttonIconSize} color={showStatistics ? "#fff" : "#64748b"} />
          <Text style={[styles.controlButtonText, showStatistics && styles.controlButtonTextActive, { fontSize: buttonFontSize }]} numberOfLines={1}>
            Statistics
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, showLegend && styles.controlButtonActive, { minHeight: buttonMinHeight }]}
          onPress={handleLegendPress}
          activeOpacity={0.7}
        >
          <Ionicons name="list-outline" size={buttonIconSize} color={showLegend ? "#fff" : "#64748b"} />
          <Text style={[styles.controlButtonText, showLegend && styles.controlButtonTextActive, { fontSize: buttonFontSize }]} numberOfLines={1}>
            Legend
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 20.5937, // Center of India
          longitude: 78.9629,
          latitudeDelta: 28, // Increased to cover from Kashmir to Kanyakumari
          longitudeDelta: 30, // Increased to cover from Gujarat to Northeast states
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
      >
        {filteredStations.map(renderStation).filter(Boolean)}
      </MapView>

      {/* DWLR Station Popup - READY FOR ACTIVATION */}
      <DWLRStationPopup
        ref={dwlrPopupRef}
        stationData={selectedStationData}
        isVisible={!!selectedStationData}
        variant="light"
        onClose={() => {
          console.log('🔽 Popup closed, clearing selected station');
          setSelectedStationData(null);
          setSelectedStation(null);
        }}
      />

      {/* Filter Panel Overlay */}
      {showFilterPanel && (
        <View style={styles.overlayContainer}>
          <TouchableOpacity 
            style={styles.overlayBackdrop} 
            onPress={() => setShowFilterPanel(false)}
          />
          <View style={styles.filterPanel}>
            <Text style={styles.panelTitle}>Filter Stations</Text>
            
            {/* Water Level Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Ground Water Level</Text>
              <View style={styles.filterGroup}>
                {['all', 'low', 'moderate', 'high'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.filterButton, waterFilter === option && styles.filterButtonActive]}
                    onPress={() => setWaterFilter(option)}
                  >
                    <Text style={[
                      styles.filterButtonText, 
                      waterFilter === option && styles.filterButtonTextActive
                    ]}>
                      {option.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rainfall Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Rainfall (Monthly)</Text>
              <View style={styles.filterGroup}>
                {['all', 'low', 'moderate', 'high'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.filterButton, rainfallFilter === option && styles.filterButtonActive]}
                    onPress={() => setRainfallFilter(option)}
                  >
                    <Text style={[
                      styles.filterButtonText, 
                      rainfallFilter === option && styles.filterButtonTextActive
                    ]}>
                      {option.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Aquifer Quality Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Aquifer Quality</Text>
              <View style={styles.filterGroup}>
                {['all', 'excellent', 'good', 'moderate', 'poor'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.filterButton, aquiferFilter === option && styles.filterButtonActive]}
                    onPress={() => setAquiferFilter(option)}
                  >
                    <Text style={[
                      styles.filterButtonText, 
                      aquiferFilter === option && styles.filterButtonTextActive
                    ]}>
                      {option.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.panelCloseButton}
              onPress={() => setShowFilterPanel(false)}
            >
              <Text style={styles.panelCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Statistics Panel Overlay */}
      {showStatistics && statistics && (
        <View style={styles.overlayContainer}>
          <TouchableOpacity 
            style={styles.overlayBackdrop} 
            onPress={() => setShowStatistics(false)}
          />
          <View style={styles.statisticsPanel}>
            <Text style={styles.panelTitle}>DWLR Statistics</Text>
            
            {/* Overview Cards */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{statistics.totalStations}</Text>
                <Text style={styles.statLabel}>Total Stations</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#22c55e' }]}>
                  {statistics.safeStations}
                </Text>
                <Text style={styles.statLabel}>Safe Stations</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#ef4444' }]}>
                  {statistics.criticalStations}
                </Text>
                <Text style={styles.statLabel}>Critical Stations</Text>
              </View>
            </View>

            {/* Detailed Statistics */}
            <View style={styles.detailedStats}>
              <Text style={styles.sectionTitle}>Water Level Analysis</Text>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Average Level:</Text>
                <Text style={styles.statRowValue}>{statistics.avgWaterLevel}m</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Range:</Text>
                <Text style={styles.statRowValue}>
                  {statistics.minWaterLevel}m - {statistics.maxWaterLevel}m
                </Text>
              </View>
              
              <Text style={styles.sectionTitle}>Rainfall Data</Text>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Average Monthly:</Text>
                <Text style={styles.statRowValue}>{statistics.avgRainfall}mm</Text>
              </View>
              
              <Text style={styles.sectionTitle}>Aquifer Quality Distribution</Text>
              {Object.entries(statistics.qualityDistribution).map(([quality, count]) => (
                <View key={quality} style={styles.statRow}>
                  <Text style={styles.statRowLabel}>{quality}:</Text>
                  <Text style={styles.statRowValue}>{count} stations</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.panelCloseButton}
              onPress={() => setShowStatistics(false)}
            >
              <Text style={styles.panelCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Legend Overlay */}
      {showLegend && (
        <View style={styles.overlayContainer}>
          <TouchableOpacity 
            style={styles.overlayBackdrop} 
            onPress={() => setShowLegend(false)}
          />
          <View style={styles.legendPanel}>
            <Text style={styles.panelTitle}>Water Level Legend</Text>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendMarker, { backgroundColor: '#ff4444' }]} />
              <Text style={styles.legendText}>Low (&lt; 2m)</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendMarker, { backgroundColor: '#ff8800' }]} />
              <Text style={styles.legendText}>Moderate (2-5m)</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendMarker, { backgroundColor: '#44aa44' }]} />
              <Text style={styles.legendText}>High (&gt; 5m)</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.panelCloseButton}
              onPress={() => setShowLegend(false)}
            >
              <Text style={styles.panelCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 40,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 16,
  },
  webFallbackText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  modernHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
  },
  
  controlPanel: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  controlButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
    elevation: 3,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    transform: [{ scale: 1.02 }],
  },
  controlButtonText: {
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  controlButtonTextActive: {
    color: '#ffffff',
  },
  
  map: { 
    flex: 1 
  },
  
  customMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  selectedMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3b82f6',
    transform: [{ scale: 1.1 }],
  },
  
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  filterPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: '80%',
  },
  
  statisticsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: '85%',
  },
  
  legendPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    minHeight: 280,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  
  filterSection: {
    marginBottom: 20,
  },
  
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  
  filterGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  
  filterButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  
  filterButtonTextActive: {
    color: '#fff',
  },

  // Statistics styles
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  detailedStats: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
  },
  
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  
  statRowLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  
  statRowValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  legendMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  legendText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  
  panelCloseButton: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  panelCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
