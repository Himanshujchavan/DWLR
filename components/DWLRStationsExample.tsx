import { MapPin } from 'lucide-react-native';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DWLRStationPopup, { DWLRStationPopupRef, STATIONS, getStationsByRegion } from './DWLRStationPopup';

const DWLRStationsExample = () => {
  const popupRef = useRef<DWLRStationPopupRef>(null);
  const [selectedStation, setSelectedStation] = React.useState(STATIONS[0]);

  const handleStationPress = (station: typeof STATIONS[0]) => {
    setSelectedStation(station);
    popupRef.current?.expand();
  };

  const regions = [
    { key: 'west' as const, name: 'West Region', color: '#3B82F6' },
    { key: 'south' as const, name: 'South Region', color: '#10B981' },
    { key: 'north' as const, name: 'North Region', color: '#F59E0B' },
    { key: 'east' as const, name: 'East Region', color: '#EF4444' },
    { key: 'central' as const, name: 'Central Region', color: '#8B5CF6' },
    { key: 'northeast' as const, name: 'Northeast Region', color: '#06B6D4' },
    { key: 'rajasthan' as const, name: 'Rajasthan Region', color: '#F97316' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DWLR Stations ({STATIONS.length} Total)</Text>
      
      <ScrollView style={styles.scrollView}>
        {regions.map(region => {
          const regionStations = getStationsByRegion(region.key);
          if (regionStations.length === 0) return null;
          
          return (
            <View key={region.key} style={styles.regionSection}>
              <Text style={[styles.regionTitle, { color: region.color }]}>
                {region.name} ({regionStations.length} stations)
              </Text>
              
              <View style={styles.stationGrid}>
                {regionStations.map(station => (
                  <TouchableOpacity
                    key={station.id}
                    style={[styles.stationCard, { borderLeftColor: region.color }]}
                    onPress={() => handleStationPress(station)}
                  >
                    <View style={styles.stationInfo}>
                      <Text style={styles.stationName}>{station.name}</Text>
                      <View style={styles.locationRow}>
                        <MapPin size={12} color="#666" />
                        <Text style={styles.stationLocation}>{station.location}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.stationStats}>
                      <Text style={[
                        styles.waterLevel,
                        { 
                          color: station.groundwater.status === 'safe' ? '#10B981' : 
                               station.groundwater.status === 'semi-critical' ? '#F59E0B' : '#EF4444'
                        }
                      ]}>
                        {station.groundwater.currentLevel}m
                      </Text>
                      <Text style={styles.statusText}>
                        {station.groundwater.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <DWLRStationPopup
        ref={popupRef}
        stationData={selectedStation}
        variant="light"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  scrollView: {
    flex: 1,
  },
  regionSection: {
    margin: 16,
    marginBottom: 8,
  },
  regionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stationGrid: {
    gap: 8,
  },
  stationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stationLocation: {
    fontSize: 12,
    color: '#666',
  },
  stationStats: {
    alignItems: 'flex-end',
  },
  waterLevel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#666',
    marginTop: 2,
  },
});

export default DWLRStationsExample;