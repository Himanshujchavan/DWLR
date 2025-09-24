import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface StationData {
  id: string;
  name: string;
  waterLevel: number;
  depth: number;
  aquiferType: string;
  gwAvailability: string;
  quality: {
    ph: number;
    tds: number;
    salinity: string;
  };
}

interface DWLRStationPopupProps {
  station: StationData;
  onClose?: () => void;
  onFocus?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

// Helper functions (duplicated from map for demo purposes)
const waterLevelCategory = (wl: number) => {
  if (wl < 2) return 'low';
  if (wl < 5) return 'moderate';
  return 'high';
};

const stationColor = (wl: number) => {
  const cat = waterLevelCategory(wl);
  switch (cat) {
    case 'low': return 'red';
    case 'moderate': return 'orange';
    case 'high': return 'green';
    default: return 'gray';
  }
};

const getWaterQualityStatus = (quality: StationData['quality']) => {
  if (!quality) return 'Unknown';
  const { ph, tds, salinity } = quality;
  
  if (salinity === 'Saline' || tds > 1500 || ph < 6.5 || ph > 8.5) return 'Poor';
  if (tds > 1000 || ph < 6.8 || ph > 8.2) return 'Moderate';
  return 'Good';
};

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'Excellent': return '#22c55e';
    case 'Good': return '#84cc16';
    case 'Moderate': return '#eab308';
    case 'Poor': return '#f97316';
    default: return '#6b7280';
  }
};

const getQualityColor = (status: string) => {
  switch (status) {
    case 'Good': return '#22c55e';
    case 'Moderate': return '#eab308';
    case 'Poor': return '#ef4444';
    default: return '#6b7280';
  }
};

const getAquiferInfo = (aquiferType: string) => {
  const aquiferData: Record<string, {
    description: string;
    permeability: string;
    storage: string;
  }> = {
    'Alluvial': { 
      description: 'High porosity, good yield', 
      permeability: 'High',
      storage: 'Excellent'
    },
    'Crystalline': { 
      description: 'Fractured rock, variable yield', 
      permeability: 'Variable',
      storage: 'Moderate'
    },
    'Basaltic': { 
      description: 'Vesicular rock, moderate yield', 
      permeability: 'Moderate',
      storage: 'Good'
    },
    'Sedimentary': { 
      description: 'Layered rock, good storage', 
      permeability: 'Moderate to High',
      storage: 'Good'
    }
  };
  
  return aquiferData[aquiferType] || {
    description: 'Mixed formation',
    permeability: 'Variable',
    storage: 'Variable'
  };
};

export default function DWLRStationPopup({ 
  station, 
  onClose, 
  onFocus, 
  isFavorite = false, 
  onToggleFavorite 
}: DWLRStationPopupProps) {
  const qualityStatus = getWaterQualityStatus(station.quality);
  const aquiferInfo = getAquiferInfo(station.aquiferType);

  return (
    <View style={styles.enhancedCallout}>
      {/* Header Section */}
      <View style={styles.calloutHeader}>
        <View style={styles.stationTitleContainer}>
          <Text style={styles.calloutTitle}>{station.name}</Text>
          <Text style={styles.stationId}>ID: {station.id}</Text>
        </View>
        <View style={styles.headerActions}>
          {onToggleFavorite && (
            <Pressable 
              onPress={onToggleFavorite}
              style={styles.favoriteButton}
            >
              <Ionicons 
                name={isFavorite ? "star" : "star-outline"}
                size={20}
                color={isFavorite ? "#ffd700" : "#ccc"}
              />
            </Pressable>
          )}
          {onClose && (
            <Pressable 
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Groundwater Level Section */}
      <View style={styles.statisticsSection}>
        <View style={styles.sectionTitle}>
          <Ionicons name="water" size={16} color="#2563eb" />
          <Text style={styles.sectionTitleText}>Groundwater Level</Text>
        </View>
        <View style={styles.levelStats}>
          <View style={styles.levelItem}>
            <Text style={styles.levelValue}>{station.waterLevel}m</Text>
            <Text style={styles.levelLabel}>Current Level</Text>
            <Text style={[styles.levelCategory, { 
              color: stationColor(station.waterLevel) 
            }]}>
              {waterLevelCategory(station.waterLevel).toUpperCase()}
            </Text>
          </View>
          <View style={styles.levelItem}>
            <Text style={styles.levelValue}>{station.depth}m</Text>
            <Text style={styles.levelLabel}>Total Depth</Text>
          </View>
          <View style={styles.levelItem}>
            <Text style={styles.levelValue}>
              {Math.max(0, station.depth - station.waterLevel).toFixed(1)}m
            </Text>
            <Text style={styles.levelLabel}>Available</Text>
          </View>
        </View>
      </View>

      {/* Aquifer Information Section */}
      <View style={styles.statisticsSection}>
        <View style={styles.sectionTitle}>
          <Ionicons name="layers" size={16} color="#059669" />
          <Text style={styles.sectionTitleText}>Aquifer Information</Text>
        </View>
        <View style={styles.aquiferInfo}>
          <View style={styles.aquiferItem}>
            <Text style={styles.aquiferType}>{station.aquiferType}</Text>
            <Text style={styles.aquiferDescription}>{aquiferInfo.description}</Text>
          </View>
          <View style={styles.aquiferProperties}>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyLabel}>Permeability:</Text>
              <Text style={styles.propertyValue}>{aquiferInfo.permeability}</Text>
            </View>
            <View style={styles.propertyItem}>
              <Text style={styles.propertyLabel}>Storage:</Text>
              <Text style={styles.propertyValue}>{aquiferInfo.storage}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Groundwater Availability Section */}
      <View style={styles.statisticsSection}>
        <View style={styles.sectionTitle}>
          <Ionicons name="analytics" size={16} color="#7c3aed" />
          <Text style={styles.sectionTitleText}>Availability & Quality</Text>
        </View>
        <View style={styles.availabilityInfo}>
          <View style={styles.availabilityItem}>
            <Text style={styles.availabilityLabel}>Status:</Text>
            <View style={[styles.availabilityBadge, { 
              backgroundColor: getAvailabilityColor(station.gwAvailability) + '20',
              borderColor: getAvailabilityColor(station.gwAvailability)
            }]}>
              <Text style={[styles.availabilityText, { 
                color: getAvailabilityColor(station.gwAvailability) 
              }]}>
                {station.gwAvailability}
              </Text>
            </View>
          </View>
          
          <View style={styles.qualityMetrics}>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>pH:</Text>
              <Text style={[styles.qualityValue, { 
                color: getQualityColor(qualityStatus) 
              }]}>
                {station.quality.ph}
              </Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>TDS:</Text>
              <Text style={[styles.qualityValue, { 
                color: getQualityColor(qualityStatus) 
              }]}>
                {station.quality.tds} ppm
              </Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Salinity:</Text>
              <Text style={[styles.qualityValue, { 
                color: getQualityColor(qualityStatus) 
              }]}>
                {station.quality.salinity}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Button */}
      {onFocus && (
        <Pressable 
          onPress={onFocus}
          style={styles.enhancedFocusButton}
        >
          <Ionicons name="location" size={16} color="#fff" />
          <Text style={styles.enhancedFocusButtonText}>Focus on Station</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  enhancedCallout: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 0,
    minWidth: 320,
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    margin: 20,
  },
  
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#f8fafc',
  },
  
  stationTitleContainer: {
    flex: 1,
  },
  
  calloutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  
  stationId: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  favoriteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  
  statisticsSection: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  sectionTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  levelItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  
  levelValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  
  levelLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  
  levelCategory: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  aquiferInfo: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 10,
  },
  
  aquiferItem: {
    marginBottom: 8,
  },
  
  aquiferType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  
  aquiferDescription: {
    fontSize: 11,
    color: '#374151',
    fontStyle: 'italic',
  },
  
  aquiferProperties: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  propertyItem: {
    flex: 1,
  },
  
  propertyLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  propertyValue: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  
  availabilityInfo: {
    backgroundColor: '#faf5ff',
    borderRadius: 10,
    padding: 10,
  },
  
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  
  availabilityLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  
  availabilityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  
  qualityMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  
  qualityItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  
  qualityLabel: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  
  qualityValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  
  enhancedFocusButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  
  enhancedFocusButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});