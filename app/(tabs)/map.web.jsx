import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const makeStation = (id, name, lat, long, waterLevel, depth) => ({ id, name, lat, long, waterLevel, depth });

// Enhanced DWLR Stations with regional distribution
const STATIONS = [
  // North Region - Delhi & NCR
  makeStation('DWLR_DEL_01', 'Delhi Central', 28.6139, 77.2090, 3.4, 40),
  makeStation('DWLR_DEL_02', 'Gurgaon', 28.4595, 77.0266, 1.8, 35),
  makeStation('DWLR_GZB_01', 'Ghaziabad', 28.6692, 77.4538, 2.1, 32),
  makeStation('DWLR_FAR_01', 'Faridabad', 28.4089, 77.3178, 1.9, 38),
  
  // West Region - Maharashtra & Gujarat
  makeStation('DWLR_MUM_01', 'Mumbai Central', 19.0760, 72.8777, 1.5, 28),
  makeStation('DWLR_PUN_01', 'Pune', 18.5204, 73.8567, 0.9, 26),
  makeStation('DWLR_NGP_01', 'Nagpur', 21.1458, 79.0882, 5.1, 29),
  makeStation('DWLR_AHD_01', 'Ahmedabad', 23.0225, 72.5714, 2.6, 34),
  makeStation('DWLR_SRT_01', 'Surat', 21.1702, 72.8311, 2.0, 31),
  makeStation('DWLR_NAS_01', 'Nashik', 19.9975, 73.7898, 3.2, 33),
  
  // South Region - Tamil Nadu, Karnataka, Andhra Pradesh
  makeStation('DWLR_CHN_01', 'Chennai', 13.0827, 80.2707, 4.8, 35),
  makeStation('DWLR_BLR_01', 'Bangalore', 12.9716, 77.5946, 5.2, 41),
  makeStation('DWLR_HYD_01', 'Hyderabad', 17.3850, 78.4867, 5.6, 38),
  makeStation('DWLR_CJB_01', 'Coimbatore', 11.0168, 76.9558, 6.2, 42),
  makeStation('DWLR_TVM_01', 'Thiruvananthapuram', 8.5241, 76.9366, 3.9, 37),
  makeStation('DWLR_VZG_01', 'Visakhapatnam', 17.6868, 83.2185, 5.4, 39),
  makeStation('DWLR_MDR_01', 'Madurai', 9.9252, 78.1198, 2.7, 36),
  
  // East Region - West Bengal, Odisha, Jharkhand
  makeStation('DWLR_KOL_01', 'Kolkata', 22.5726, 88.3639, 1.9, 32),
  makeStation('DWLR_RNC_01', 'Ranchi', 23.3441, 85.3096, 4.1, 27),
  makeStation('DWLR_BBN_01', 'Bhubaneswar', 20.2961, 85.8245, 3.5, 34),
  makeStation('DWLR_DHN_01', 'Dhanbad', 23.7957, 86.4304, 1.6, 29),
  
  // Central Region - Madhya Pradesh, Uttar Pradesh
  makeStation('DWLR_BPL_01', 'Bhopal', 23.2599, 77.4126, 2.8, 31),
  makeStation('DWLR_LKN_01', 'Lucknow', 26.8467, 80.9462, 3.1, 36),
  makeStation('DWLR_GWAL_01', 'Gwalior', 26.2183, 78.1828, 1.7, 33),
  makeStation('DWLR_IND_01', 'Indore', 22.7196, 75.8577, 2.3, 35),
  makeStation('DWLR_KAN_01', 'Kanpur', 26.4499, 80.3319, 1.4, 30),
  
  // North East Region
  makeStation('DWLR_GHY_01', 'Guwahati', 26.1445, 91.7362, 1.3, 28),
  makeStation('DWLR_SHL_01', 'Shillong', 25.5788, 91.8933, 4.9, 24),
  makeStation('DWLR_IMP_01', 'Imphal', 24.8170, 93.9368, 2.4, 22),
  makeStation('DWLR_AGT_01', 'Agartala', 23.8315, 91.2868, 3.6, 25),
  
  // Rajasthan Region
  makeStation('DWLR_JAI_01', 'Jaipur', 26.9124, 75.7873, 2.2, 30),
  makeStation('DWLR_JDH_01', 'Jodhpur', 26.2389, 73.0243, 1.1, 28),
  makeStation('DWLR_UDR_01', 'Udaipur', 24.5854, 73.7125, 2.9, 32),
];

// Recharge zones (synthetic). recharge value in mm/day (mock).
const RECHARGE_ZONES = [
  { id: 'RZ_WEST_1', recharge: 1.5, coordinates: [
    { latitude: 18.9, longitude: 72.6 }, { latitude: 19.3, longitude: 72.9 }, { latitude: 18.8, longitude: 73.2 }, { latitude: 18.6, longitude: 72.8 }
  ]},
  { id: 'RZ_WEST_2', recharge: 3.2, coordinates: [
    { latitude: 21.0, longitude: 72.6 }, { latitude: 21.3, longitude: 73.0 }, { latitude: 20.8, longitude: 73.1 }, { latitude: 20.6, longitude: 72.7 }
  ]},
  { id: 'RZ_SOUTH_1', recharge: 4.5, coordinates: [
    { latitude: 12.9, longitude: 79.9 }, { latitude: 13.3, longitude: 80.3 }, { latitude: 12.8, longitude: 80.4 }, { latitude: 12.6, longitude: 80.0 }
  ]},
  { id: 'RZ_CENTRAL_1', recharge: 2.7, coordinates: [
    { latitude: 23.0, longitude: 77.1 }, { latitude: 23.3, longitude: 77.5 }, { latitude: 22.9, longitude: 77.6 }, { latitude: 22.7, longitude: 77.2 }
  ]},
  { id: 'RZ_EAST_1', recharge: 5.1, coordinates: [
    { latitude: 22.4, longitude: 88.1 }, { latitude: 22.7, longitude: 88.5 }, { latitude: 22.3, longitude: 88.6 }, { latitude: 22.1, longitude: 88.2 }
  ]},
];

// Alerts with severity & radius (m)
const ALERTS = [
  { id: 'AL_DEL', lat: 28.60, long: 77.20, radius: 25000, severity: 'high', message: 'Critical depletion risk' },
  { id: 'AL_MUM', lat: 19.05, long: 72.88, radius: 18000, severity: 'medium', message: 'Declining trend detected' },
  { id: 'AL_CHN', lat: 13.06, long: 80.25, radius: 20000, severity: 'high', message: 'Salinity ingress risk' },
  { id: 'AL_KOL', lat: 22.60, long: 88.40, radius: 15000, severity: 'low', message: 'Monitoring zone' },
];

// Simplified state boundary polygons (extremely coarse & fictive shapes for demo)
const BOUNDARIES = [
  { id: 'BD_MH', name: 'Maharashtra (demo)', coordinates: [
    { latitude: 22.0, longitude: 80.5 }, { latitude: 22.0, longitude: 72.5 }, { latitude: 16.5, longitude: 72.5 }, { latitude: 16.5, longitude: 80.5 }
  ]},
  { id: 'BD_DL', name: 'Delhi (demo)', coordinates: [
    { latitude: 28.9, longitude: 77.0 }, { latitude: 28.9, longitude: 77.4 }, { latitude: 28.4, longitude: 77.4 }, { latitude: 28.4, longitude: 77.0 }
  ]},
  { id: 'BD_TN', name: 'Tamil Nadu (demo)', coordinates: [
    { latitude: 13.6, longitude: 78.0 }, { latitude: 13.6, longitude: 80.5 }, { latitude: 8.0, longitude: 80.5 }, { latitude: 8.0, longitude: 78.0 }
  ]},
];

// Optional simplified national boundary (rough bounding polygon) for highlighting India.
const INDIA_OUTLINE = [
  { latitude: 35.0, longitude: 77.0 },
  { latitude: 34.0, longitude: 80.0 },
  { latitude: 28.0, longitude: 88.0 },
  { latitude: 22.0, longitude: 93.0 },
  { latitude: 20.0, longitude: 95.0 },
  { latitude: 15.0, longitude: 94.0 },
  { latitude: 8.0, longitude: 93.0 },
  { latitude: 6.0, longitude: 80.0 },
  { latitude: 8.0, longitude: 72.0 },
  { latitude: 15.0, longitude: 68.2 },
  { latitude: 20.0, longitude: 68.2 },
  { latitude: 23.0, longitude: 70.0 },
  { latitude: 28.0, longitude: 72.0 },
  { latitude: 32.0, longitude: 74.0 },
  { latitude: 35.0, longitude: 77.0 },
];

// ------------------------------------------------------------
// Utility helpers
// ------------------------------------------------------------
const waterLevelCategory = (wl) => {
  if (wl < 2) return 'low';
  if (wl < 5) return 'moderate';
  return 'high';
};

const stationColor = (wl) => {
  const cat = waterLevelCategory(wl);
  switch (cat) {
    case 'low': return '#ef4444';
    case 'moderate': return '#f59e42';
    case 'high': return '#10b981';
    default: return '#6b7280';
  }
};

const severityColors = {
  high: { stroke: 'rgba(200,0,0,0.95)', fill: 'rgba(255,0,0,0.25)' },
  medium: { stroke: 'rgba(210,140,0,0.95)', fill: 'rgba(255,165,0,0.25)' },
  low: { stroke: 'rgba(0,110,255,0.95)', fill: 'rgba(0,110,255,0.20)' }
};

// Generate mock historical water level arrays for each station (12 months) referencing initial static value
const HISTORICAL_MAP = STATIONS.reduce((acc, st) => {
  const base = st.waterLevel;
  const months = Array.from({ length: 12 }).map((_, i) => {
    // simulate seasonal sine wave + slight trend
    const seasonal = Math.sin((i / 12) * Math.PI * 2) * 0.6; // +-0.6
    const drift = (Math.random() - 0.5) * 0.3; // random small drift per series
    return +(base + seasonal + drift).toFixed(2);
  });
  acc[st.id] = months;
  return acc;
}, {});

const classifyTrend = (series) => {
  if (!series || series.length < 2) return 'stable';
  const first = series[0];
  const last = series[series.length - 1];
  const change = last - first;
  if (change < -0.8) return 'strong-decline';
  if (change < -0.3) return 'decline';
  if (change > 0.8) return 'strong-rise';
  if (change > 0.3) return 'rise';
  return 'stable';
};



// Web-compatible map component using Leaflet
const MapView = ({ style, initialRegion, showsUserLocation, children, stations, showRecharge, showAlerts, showBoundaries, showOutline, filteredAlerts, season }) => {
  const [map, setMap] = useState(null);
  const [mapContainer, setMapContainer] = useState(null);

  useEffect(() => {
    // Dynamically import Leaflet only on web
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Import Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (mapContainer && !map) {
          const leafletMap = L.map(mapContainer).setView(
            [initialRegion?.latitude || 20.5937, initialRegion?.longitude || 78.9629], 
            5
          );

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(leafletMap);

          // Add India outline if enabled
          if (showOutline && INDIA_OUTLINE) {
            const indiaCoords = INDIA_OUTLINE.map(coord => [coord.latitude, coord.longitude]);
            L.polygon(indiaCoords, {
              color: 'rgba(0,0,0,0.35)',
              fillColor: 'rgba(0,0,0,0.03)',
              weight: 2,
              fillOpacity: 0.03
            }).addTo(leafletMap);
          }

          // Add boundaries if enabled
          if (showBoundaries && BOUNDARIES) {
            BOUNDARIES.forEach(boundary => {
              if (boundary.coordinates) {
                const coords = boundary.coordinates.map(coord => [coord.latitude, coord.longitude]);
                L.polygon(coords, {
                  color: 'rgba(0,0,180,0.7)',
                  fillColor: 'rgba(0,0,255,0.10)',
                  weight: 2,
                  fillOpacity: 0.1
                }).addTo(leafletMap).bindPopup(`<strong>${boundary.name}</strong>`);
              }
            });
          }

          // Add recharge zones if enabled
          if (showRecharge && RECHARGE_ZONES) {
            RECHARGE_ZONES.forEach(zone => {
              if (zone.coordinates) {
                let multiplier = 1;
                switch (season) {
                  case 'monsoon': multiplier = 1.8; break;
                  case 'post-monsoon': multiplier = 1.2; break;
                  case 'dry': multiplier = 0.6; break;
                  default: multiplier = 1; // pre-monsoon
                }
                const effective = zone.recharge * multiplier;
                const fillColor = effective < 2 ? 'rgba(255,0,0,0.30)'
                  : effective < 4 ? 'rgba(255,165,0,0.30)'
                  : 'rgba(0,180,0,0.40)';
                
                const coords = zone.coordinates.map(coord => [coord.latitude, coord.longitude]);
                L.polygon(coords, {
                  color: 'rgba(0,0,0,0.35)',
                  fillColor: fillColor,
                  weight: 1,
                  fillOpacity: 0.3
                }).addTo(leafletMap).bindPopup(`
                  <div style="font-family: Arial, sans-serif;">
                    <h4 style="margin: 0 0 8px 0; color: #1a237e;">Recharge Zone ${zone.id}</h4>
                    <p style="margin: 4px 0;"><strong>Base Recharge:</strong> ${zone.recharge} mm/day</p>
                    <p style="margin: 4px 0;"><strong>Effective (${season}):</strong> ${effective.toFixed(1)} mm/day</p>
                  </div>
                `);
              }
            });
          }

          // Add alerts if enabled
          if (showAlerts && filteredAlerts) {
            filteredAlerts.forEach(alert => {
              const colors = severityColors[alert.severity] || severityColors.low;
              L.circle([alert.lat, alert.long], {
                radius: alert.radius,
                color: colors.stroke,
                fillColor: colors.fill,
                weight: 2,
                fillOpacity: 0.25
              }).addTo(leafletMap).bindPopup(`
                <div style="font-family: Arial, sans-serif;">
                  <h4 style="margin: 0 0 8px 0; color: #1a237e;">Alert: ${alert.severity.toUpperCase()}</h4>
                  <p style="margin: 4px 0;"><strong>Message:</strong> ${alert.message}</p>
                  <p style="margin: 4px 0;"><strong>Radius:</strong> ${(alert.radius/1000).toFixed(1)} km</p>
                </div>
              `);
            });
          }

          // Add all DWLR stations
          if (stations && Array.isArray(stations)) {
            stations.forEach(station => {
              const color = stationColor(station.waterLevel);
              const status = waterLevelCategory(station.waterLevel);
              const trend = classifyTrend(HISTORICAL_MAP[station.id] || []);
              
              const marker = L.circleMarker([station.lat, station.long], {
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                radius: 8,
                weight: 2
              }).addTo(leafletMap);

              marker.bindPopup(`
                <div style="font-family: Arial, sans-serif; min-width: 250px;">
                  <h3 style="margin: 0 0 8px 0; color: #1a237e;">${station.name}</h3>
                  <p style="margin: 4px 0;"><strong>ID:</strong> ${station.id}</p>
                  <p style="margin: 4px 0;"><strong>Water Level:</strong> ${station.waterLevel}m</p>
                  <p style="margin: 4px 0;"><strong>Depth:</strong> ${station.depth}m</p>
                  <p style="margin: 4px 0;"><strong>Status:</strong> 
                    <span style="color: ${color}; font-weight: bold; text-transform: uppercase;">${status}</span>
                  </p>
                  <p style="margin: 4px 0;"><strong>Trend:</strong> ${trend}</p>
                  <p style="margin: 4px 0; color: #666; font-size: 12px;">Last updated: 2 hours ago</p>
                </div>
              `);
            });
          }

          setMap(leafletMap);
        }
      });
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapContainer, map, initialRegion, stations, showRecharge, showAlerts, showBoundaries, showOutline, filteredAlerts, season]);

  return (
    <div 
      ref={setMapContainer} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px'
      }} 
    />
  );
};

// Web-compatible marker component (markers are handled in MapView component above)

export default function MapScreen() {
  // UI state
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Layer visibility toggles
  const [showStations, setShowStations] = useState(true);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [season, setSeason] = useState('pre-monsoon'); // pre-monsoon | monsoon | post-monsoon | dry
  const [realTimeOn, setRealTimeOn] = useState(true);

  // Enhanced filter state
  const [waterFilter, setWaterFilter] = useState('all'); // all | low | moderate | high
  const [waterLevelRange] = useState([0, 10]); // [min, max] in meters
  const [searchText, setSearchText] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [alertFilter] = useState('all'); // all | high | medium | low

  // Real-time mutable station state (clone from static initial)
  const [liveStations, setLiveStations] = useState(() => STATIONS.map(s => ({ ...s })));
  const intervalRef = useRef(null);

  // Simple simulation: small random walk of waterLevel staying >=0
  useEffect(() => {
    if (!realTimeOn) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setLiveStations(prev => prev.map(st => {
        const delta = (Math.random() - 0.5) * 0.2; // +/-0.1 average
        let wl = Math.max(0, +(st.waterLevel + delta).toFixed(2));
        return { ...st, waterLevel: wl };
      }));
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [realTimeOn]);

  // Enhanced memoized filtered station list
  const filteredStations = useMemo(() => {
    if (!liveStations || !Array.isArray(liveStations)) return [];
    
    let filtered = liveStations;
    
    // Water level category filter
    if (waterFilter !== 'all') {
      filtered = filtered.filter(s => s && waterLevelCategory(s.waterLevel) === waterFilter);
    }
    
    // Water level range filter
    if (waterLevelRange && Array.isArray(waterLevelRange) && waterLevelRange.length >= 2) {
      filtered = filtered.filter(s => 
        s && typeof s.waterLevel === 'number' &&
        s.waterLevel >= waterLevelRange[0] && s.waterLevel <= waterLevelRange[1]
      );
    }
    
    // Search filter
    if (searchText && searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(s => 
        s && s.name && s.id &&
        (s.name.toLowerCase().includes(search) || 
         s.id.toLowerCase().includes(search))
      );
    }
    
    return filtered;
  }, [waterFilter, liveStations, waterLevelRange, searchText]);

  // Dynamic alerts from stations (low water level conditions)
  const dynamicAlerts = useMemo(() => {
    if (!liveStations || !Array.isArray(liveStations)) return [];
    
    return liveStations
      .filter(s => s && typeof s.waterLevel === 'number' && s.waterLevel < 1.2)
      .map(s => ({
        id: `dyn-${s.id}`,
        lat: s.lat,
        long: s.long,
        radius: 12000,
        severity: s.waterLevel < 0.6 ? 'high' : 'medium',
        message: 'Low water level'
      }));
  }, [liveStations]);

  const mergedAlerts = useMemo(() => [...ALERTS, ...dynamicAlerts], [dynamicAlerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    const base = mergedAlerts;
    if (alertFilter === 'all') return base;
    return base.filter(alert => alert.severity === alertFilter);
  }, [alertFilter, mergedAlerts]);

  const filterOptions = [
    { key: 'all', label: 'All Stations', color: '#6366f1', count: STATIONS.length },
    { key: 'water_level', label: 'Water Level', color: '#2563eb', count: filteredStations.filter(s => waterLevelCategory(s.waterLevel) === 'high').length },
    { key: 'quality', label: 'Quality Monitor', color: '#10b981', count: filteredStations.filter(s => waterLevelCategory(s.waterLevel) === 'moderate').length },
    { key: 'rainfall', label: 'Rainfall Gauge', color: '#f59e42', count: filteredStations.filter(s => waterLevelCategory(s.waterLevel) === 'low').length },
    { key: 'recharge', label: 'Recharge Zone', color: '#22d3ee', count: RECHARGE_ZONES.length },
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>DWLR Station Map</ThemedText>
        <ThemedText style={styles.subtitle}>Real-time monitoring across India</ThemedText>
      </ThemedView>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        {filterOptions.map((filter) => (
          <View
            key={filter.key}
            style={[
              styles.filterPill,
              { backgroundColor: selectedFilter === filter.key ? filter.color : '#f1f5f9' },
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedFilter === filter.key ? '#ffffff' : '#64748b' },
              ]}
            >
              {filter.label} ({filter.count})
            </Text>
          </View>
        ))}
      </View>

      {/* Interactive Control Panel */}
      <View style={styles.controlPanel}>
        {/* Quick Action Bar */}
        <View style={styles.quickActionBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionContent}>
            <Pressable 
              style={[styles.actionButton, showFilterPanel && styles.actionButtonActive]}
              onPress={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Ionicons 
                name="filter" 
                size={16} 
                color={showFilterPanel ? "#fff" : "#333"} 
                style={styles.actionIcon}
              />
              <Text style={[styles.actionButtonText, showFilterPanel && styles.actionButtonTextActive]}>Filters</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.actionButton, showLegend && styles.actionButtonActive]}
              onPress={() => setShowLegend(!showLegend)}
            >
              <MaterialIcons 
                name="legend-toggle" 
                size={16} 
                color={showLegend ? "#fff" : "#333"} 
                style={styles.actionIcon}
              />
              <Text style={[styles.actionButtonText, showLegend && styles.actionButtonTextActive]}>Legend</Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionButton}
              onPress={() => setRealTimeOn(!realTimeOn)}
            >
              <Ionicons 
                name={realTimeOn ? "pause" : "play"} 
                size={16} 
                color="#333" 
                style={styles.actionIcon}
              />
              <Text style={styles.actionButtonText}>{realTimeOn ? 'Pause' : 'Resume'}</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Expandable Filter Panel */}
        {showFilterPanel && (
          <View style={styles.filterPanel}>
            <ScrollView style={styles.filterScrollView}>
              {/* Search Section */}
              <View style={styles.filterSection}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="search" size={16} color="#333" />
                  <Text style={styles.filterSectionTitle}>Search Stations</Text>
                </View>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name or ID..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              {/* Layer Toggles */}
              <View style={styles.filterSection}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="layers" size={16} color="#333" />
                  <Text style={styles.filterSectionTitle}>Map Layers</Text>
                </View>
                <View style={styles.toggleGrid}>
                  <LayerToggle label="Stations" active={showStations} onPress={() => setShowStations(v => !v)} />
                  <LayerToggle label="Alerts" active={showAlerts} onPress={() => setShowAlerts(v => !v)} />
                  <LayerToggle label="Recharge" active={showRecharge} onPress={() => setShowRecharge(v => !v)} />
                  <LayerToggle label="Boundaries" active={showBoundaries} onPress={() => setShowBoundaries(v => !v)} />
                  <LayerToggle label="Outline" active={showOutline} onPress={() => setShowOutline(v => !v)} />
                </View>
              </View>

              {/* Water Level Filter */}
              <View style={styles.filterSection}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="water" size={16} color="#333" />
                  <Text style={styles.filterSectionTitle}>Water Level Filter</Text>
                </View>
                <WaterFilterToggle current={waterFilter} onChange={setWaterFilter} />
              </View>

              {/* Season & Real-time */}
              <View style={styles.filterSection}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="partly-sunny" size={16} color="#333" />
                  <Text style={styles.filterSectionTitle}>Season</Text>
                </View>
                <SeasonToggle current={season} onChange={setSeason} />
              </View>
            </ScrollView>
          </View>
        )}

        {/* Interactive Legend */}
        {showLegend && <InteractiveLegend />}
      </View>

      {/* Map Container */}
      <ThemedView style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 20.5937,
            longitude: 78.9629,
            latitudeDelta: 15,
            longitudeDelta: 15,
          }}
          showsUserLocation={true}
          stations={showStations ? filteredStations : []}
          showRecharge={showRecharge}
          showAlerts={showAlerts}
          showBoundaries={showBoundaries}
          showOutline={showOutline}
          filteredAlerts={filteredAlerts}
          season={season}
        />
      </ThemedView>

      {/* Legend */}
      <ThemedView style={styles.legend}>
        <ThemedText style={styles.legendTitle}>Status Legend</ThemedText>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendLabel}>Good ({'>'}6m)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e42' }]} />
            <Text style={styles.legendLabel}>Warning (4-6m)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendLabel}>Critical ({'<'}4m)</Text>
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

// ------------------------------------------------------------
// UI Subcomponents
// ------------------------------------------------------------
const LayerToggle = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={[styles.toggle, active ? styles.toggleOn : styles.toggleOff]}>
    <Text style={[styles.toggleText, active ? styles.toggleTextOn : styles.toggleTextOff]}>{label}</Text>
  </Pressable>
);

const WaterFilterToggle = ({ current, onChange }) => {
  const options = ['all', 'low', 'moderate', 'high'];
  return (
    <View style={styles.filterGroup}>
      {options.map(opt => (
        <Pressable key={opt} onPress={() => onChange(opt)} style={[styles.filterChip, current === opt && styles.filterChipActive]}>
          <Text style={[styles.filterChipText, current === opt && styles.filterChipTextActive]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const SeasonToggle = ({ current, onChange }) => {
  const seasons = ['pre-monsoon', 'monsoon', 'post-monsoon', 'dry'];
  return (
    <View style={styles.seasonGroup}>
      {seasons.map(se => (
        <Pressable key={se} onPress={() => onChange(se)} style={[styles.seasonChip, current === se && styles.seasonChipActive]}>
          <Text style={[styles.seasonChipText, current === se && styles.seasonChipTextActive]}>{se.split('-')[0]}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const InteractiveLegend = () => (
  <View style={styles.legendPanel}>
    <Text style={styles.legendTitle}>Map Legend</Text>
    
    <View style={styles.legendSection}>
      <Text style={styles.legendSectionTitle}>Water Level Markers</Text>
      <View style={styles.legendItem}>
        <View style={[styles.legendMarker, { backgroundColor: '#ef4444' }]} />
        <Text style={styles.legendText}>Low (&lt; 2m)</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendMarker, { backgroundColor: '#f59e42' }]} />
        <Text style={styles.legendText}>Moderate (2-5m)</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendMarker, { backgroundColor: '#10b981' }]} />
        <Text style={styles.legendText}>High (&gt; 5m)</Text>
      </View>
    </View>
    
    <View style={styles.legendSection}>
      <Text style={styles.legendSectionTitle}>Alert Zones</Text>
      <View style={styles.legendItem}>
        <View style={[styles.legendCircle, { borderColor: '#cc0000' }]} />
        <Text style={styles.legendText}>High Severity</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendCircle, { borderColor: '#dd8800' }]} />
        <Text style={styles.legendText}>Medium Severity</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendCircle, { borderColor: '#0066ff' }]} />
        <Text style={styles.legendText}>Low Severity</Text>
      </View>
    </View>
    
    <View style={styles.legendSection}>
      <Text style={styles.legendSectionTitle}>Interactive Tips</Text>
      <Text style={styles.legendTip}>• Click stations for detailed info</Text>
      <Text style={styles.legendTip}>• Use filters to focus on specific data</Text>
      <Text style={styles.legendTip}>• Toggle layers to customize view</Text>
      <Text style={styles.legendTip}>• Search by station name or ID</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    cursor: 'pointer',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  map: {
    flex: 1,
  },
  legend: {
    margin: 16,
    marginTop: 0,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    color: '#6b7280',
  },

  // Interactive control panel
  controlPanel: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    zIndex: 1000,
    gap: 6,
  },
  quickActionBar: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionButtonActive: {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#495057',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  actionButtonTextActive: {
    color: '#fff',
  },
  actionIcon: {
    marginRight: 0,
  },

  // Filter panel
  filterPanel: {
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 14,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    marginTop: 4,
  },
  filterScrollView: {
    padding: 14,
    paddingBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
    backgroundColor: '#fbfcfd',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
    marginLeft: 2,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  // Search input
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#dee2e6',
    color: '#495057',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Toggle grid
  toggleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  toggle: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 18, 
    borderWidth: 1,
    marginBottom: 6,
    minWidth: 75,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleOn: { 
    backgroundColor: '#007bff', 
    borderColor: '#007bff',
    transform: [{ scale: 0.98 }],
  },
  toggleOff: { 
    backgroundColor: '#ffffff', 
    borderColor: '#ced4da',
  },
  toggleText: { 
    fontSize: 11, 
    fontWeight: '600',
    textAlign: 'center',
  },
  toggleTextOn: { color: '#ffffff' },
  toggleTextOff: { color: '#6c757d' },

  // Water filter
  filterGroup: { 
    flexDirection: 'row', 
    backgroundColor: '#f8f9fa', 
    padding: 6, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterChip: { 
    flex: 1,
    paddingVertical: 8, 
    borderRadius: 8, 
    backgroundColor: '#ffffff', 
    marginHorizontal: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterChipActive: { 
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    transform: [{ scale: 0.98 }],
  },
  filterChipText: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#495057',
    textTransform: 'capitalize',
  },
  filterChipTextActive: { 
    color: '#ffffff',
    fontWeight: '700',
  },

  // Season toggle
  seasonGroup: { 
    flexDirection: 'row', 
    backgroundColor: '#f8f9fa', 
    padding: 6, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  seasonChip: { 
    flex: 1,
    paddingVertical: 6, 
    borderRadius: 8, 
    backgroundColor: '#ffffff', 
    marginHorizontal: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  seasonChipActive: { 
    backgroundColor: '#17a2b8',
    borderColor: '#17a2b8',
    transform: [{ scale: 0.98 }],
  },
  seasonChipText: { 
    fontSize: 10, 
    fontWeight: '600', 
    color: '#495057',
    textTransform: 'capitalize',
  },
  seasonChipTextActive: { 
    color: '#ffffff',
    fontWeight: '700',
  },

  // Legend
  legendPanel: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    padding: 12,
    maxHeight: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    marginTop: 4,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 12,
    textAlign: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  legendSection: {
    marginBottom: 14,
    backgroundColor: '#fbfcfd',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  legendSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  legendCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  legendText: {
    fontSize: 11,
    color: '#495057',
    fontWeight: '500',
    flex: 1,
  },
  legendTip: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 4,
    fontStyle: 'italic',
    paddingLeft: 2,
  },
});