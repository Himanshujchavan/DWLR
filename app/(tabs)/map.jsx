
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Callout, Circle, Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
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
    case 'low': return 'red';
    case 'moderate': return 'orange';
    case 'high': return 'green';
    default: return 'gray';
  }
};

const severityColors = {
  high: { stroke: 'rgba(200,0,0,0.95)', fill: 'rgba(255,0,0,0.25)' },
  medium: { stroke: 'rgba(210,140,0,0.95)', fill: 'rgba(255,165,0,0.25)' },
  low: { stroke: 'rgba(0,110,255,0.95)', fill: 'rgba(0,110,255,0.20)' }
};

const polygonCentroid = (coords) => {
  if (!coords || !coords.length) return { latitude: 0, longitude: 0 };
  let area = 0, x = 0, y = 0;
  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    const f = (p1.longitude * p2.latitude) - (p2.longitude * p1.latitude);
    area += f;
    x += (p1.longitude + p2.longitude) * f;
    y += (p1.latitude + p2.latitude) * f;
  }
  area *= 0.5;
  if (area === 0) return { latitude: coords[0].latitude, longitude: coords[0].longitude };
  x /= (6 * area);
  y /= (6 * area);
  return { latitude: y, longitude: x };
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

const trendColor = (trend) => {
  switch (trend) {
    case 'strong-decline': return 'rgba(180,0,0,0.55)';
    case 'decline': return 'rgba(255,80,0,0.45)';
    case 'rise': return 'rgba(0,160,0,0.40)';
    case 'strong-rise': return 'rgba(0,100,0,0.55)';
    default: return 'rgba(120,120,120,0.35)';
  }
};

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------`
const MapScreen = () => {
  // Layer visibility toggles
  // Only stations layer visible by default; others start hidden for clarity
  const [showStations, setShowStations] = useState(true);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [showTrend, setShowTrend] = useState(false);
  const [season, setSeason] = useState('pre-monsoon'); // pre-monsoon | monsoon | post-monsoon | dry
  const [realTimeOn, setRealTimeOn] = useState(true);

  // Enhanced filter state
  const [waterFilter, setWaterFilter] = useState('all'); // all | low | moderate | high
  const [waterLevelRange, setWaterLevelRange] = useState([0, 10]); // [min, max] in meters
  const [searchText, setSearchText] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showLegend, setShowLegend] = useState(false);
  // Hide regional stats by default to keep initial map view clear
  const [showRegionalStats, setShowRegionalStats] = useState(false);
  const [alertFilter, setAlertFilter] = useState('all'); // all | high | medium | low

  // Real-time mutable station state (clone from static initial)
  const [liveStations, setLiveStations] = useState(() => STATIONS.map(s => ({ ...s })));
  const intervalRef = useRef(null);
  const mapRef = useRef(null);

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

  // boundary aggregations (average water level of stations inside bounding box of simplified polygon)
  const boundaryStats = useMemo(() => {
    if (!liveStations || !Array.isArray(liveStations)) return [];
    
    return BOUNDARIES.map(b => {
      if (!b.coordinates || !Array.isArray(b.coordinates)) {
        return { id: b.id, name: b.name, avg: null, centroid: { latitude: 0, longitude: 0 } };
      }
      
      const lats = b.coordinates.map(c => c.latitude).filter(lat => typeof lat === 'number');
      const lngs = b.coordinates.map(c => c.longitude).filter(lng => typeof lng === 'number');
      
      if (lats.length === 0 || lngs.length === 0) {
        return { id: b.id, name: b.name, avg: null, centroid: { latitude: 0, longitude: 0 } };
      }
      
      const minLat = Math.min(...lats), maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
      const inside = liveStations.filter(s => 
        s && typeof s.lat === 'number' && typeof s.long === 'number' &&
        s.lat >= minLat && s.lat <= maxLat && s.long >= minLng && s.long <= maxLng
      );
      const avg = inside.length ? (inside.reduce((a, s) => a + (s.waterLevel || 0), 0) / inside.length) : null;
      return { id: b.id, name: b.name, avg, centroid: polygonCentroid(b.coordinates) };
    });
  }, [liveStations]);

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

  // Helper functions for enhanced interactivity
  const focusOnStation = useCallback((station) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: station.lat,
        longitude: station.long,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 1000);
      setSelectedStation(station);
    }
  }, []);

  const toggleFavorite = useCallback((stationId) => {
    setFavorites(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  }, []);

  const centerOnAllStations = useCallback(() => {
    if (mapRef.current && Array.isArray(liveStations) && liveStations.length > 0) {
      // Calculate bounds for all stations
      const lats = liveStations.map(s => s.lat).filter(lat => typeof lat === 'number');
      const lngs = liveStations.map(s => s.long).filter(lng => typeof lng === 'number');
      
      if (lats.length > 0 && lngs.length > 0) {
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        const deltaLat = (maxLat - minLat) * 1.2; // Add padding
        const deltaLng = (maxLng - minLng) * 1.2;
        
        mapRef.current.animateToRegion({
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: Math.max(deltaLat, 2),
          longitudeDelta: Math.max(deltaLng, 2),
        }, 1500);
      }
    }
  }, [liveStations]);

  // Center the map on first mount (and when stations first load) only once
  const didAutoCenter = useRef(false);
  useEffect(() => {
    if (!didAutoCenter.current && liveStations && liveStations.length > 0) {
      didAutoCenter.current = true;
      // slight timeout to allow MapView to be ready
      setTimeout(() => centerOnAllStations(), 500);
    }
  }, [liveStations, centerOnAllStations]);

  const resetFilters = useCallback(() => {
    setWaterFilter('all');
    setWaterLevelRange([0, 10]);
    setSearchText('');
    setAlertFilter('all');
  }, []);

  // Calculate regional statistics for DWLR stations
  const getRegionalStats = useCallback(() => {
    const safeStations = Array.isArray(liveStations) ? liveStations : [];
    
    const regions = {
      'North': safeStations.filter(s => s && s.id.includes('DEL_') || s.id.includes('GZB_') || s.id.includes('FAR_')),
      'West': safeStations.filter(s => s && (s.id.includes('MUM_') || s.id.includes('PUN_') || s.id.includes('NGP_') || s.id.includes('AHD_') || s.id.includes('SRT_') || s.id.includes('NAS_'))),
      'South': safeStations.filter(s => s && (s.id.includes('CHN_') || s.id.includes('BLR_') || s.id.includes('HYD_') || s.id.includes('CJB_') || s.id.includes('TVM_') || s.id.includes('VZG_') || s.id.includes('MDR_'))),
      'East': safeStations.filter(s => s && (s.id.includes('KOL_') || s.id.includes('RNC_') || s.id.includes('BBN_') || s.id.includes('DHN_'))),
      'Central': safeStations.filter(s => s && (s.id.includes('BPL_') || s.id.includes('LKN_') || s.id.includes('GWAL_') || s.id.includes('IND_') || s.id.includes('KAN_'))),
      'NorthEast': safeStations.filter(s => s && (s.id.includes('GHY_') || s.id.includes('SHL_') || s.id.includes('IMP_') || s.id.includes('AGT_'))),
      'Rajasthan': safeStations.filter(s => s && (s.id.includes('JAI_') || s.id.includes('JDH_') || s.id.includes('UDR_')))
    };

    const regionStats = Object.entries(regions).map(([region, stations]) => {
      const low = stations.filter(s => waterLevelCategory(s.waterLevel || 0) === 'low').length;
      const moderate = stations.filter(s => waterLevelCategory(s.waterLevel || 0) === 'moderate').length;
      const high = stations.filter(s => waterLevelCategory(s.waterLevel || 0) === 'high').length;
      
      return {
        region,
        total: stations.length,
        low,
        moderate,
        high,
        stations
      };
    });

    const totals = {
      total: safeStations.length,
      low: safeStations.filter(s => s && waterLevelCategory(s.waterLevel || 0) === 'low').length,
      moderate: safeStations.filter(s => s && waterLevelCategory(s.waterLevel || 0) === 'moderate').length,
      high: safeStations.filter(s => s && waterLevelCategory(s.waterLevel || 0) === 'high').length,
    };

    return { regionStats, totals };
  }, [liveStations]);

  const renderStation = useCallback((station) => {
    if (!station || !station.id || typeof station.lat !== 'number' || typeof station.long !== 'number') {
      return null;
    }
    
    const isFavorite = Array.isArray(favorites) && favorites.includes(station.id);
    const isSelected = selectedStation?.id === station.id;
    
    return (
      
      <Marker
        key={station.id}
        coordinate={{ latitude: station.lat, longitude: station.long }}
        pinColor={isSelected ? 'purple' : stationColor(station.waterLevel || 0)}
        title={station.name || 'Unknown Station'}
        description={`Water Level: ${station.waterLevel || 0} m`}
        onPress={() => focusOnStation(station)}
      >
        <Callout tooltip onPress={() => focusOnStation(station)}>
          <View style={styles.callout}>
            <View style={styles.calloutHeader}>
              <Text style={styles.calloutTitle}>{station.name || 'Unknown Station'}</Text>
              <Pressable 
                onPress={() => toggleFavorite(station.id)}
                style={styles.favoriteButton}
              >
                <Ionicons 
                  name={isFavorite ? "star" : "star-outline"}
                  size={18}
                  color={isFavorite ? "#ffd700" : "#ccc"}
                />
              </Pressable>
            </View>
            <Text style={styles.calloutText}>ID: {station.id}</Text>
            <Text style={styles.calloutText}>
              Water Level: {station.waterLevel || 0} m ({waterLevelCategory(station.waterLevel || 0)})
            </Text>
            <Text style={styles.calloutText}>Depth: {station.depth || 0} m</Text>
            <Text style={styles.calloutTrend}>
              Trend: {classifyTrend(HISTORICAL_MAP[station.id] || [])}
            </Text>
            <Pressable 
              onPress={() => focusOnStation(station)}
              style={styles.focusButton}
            >
              <Text style={styles.focusButtonText}>Focus on Station</Text>
            </Pressable>
          </View>
        </Callout>
      </Marker>
    );
  }, [favorites, selectedStation, focusOnStation, toggleFavorite]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 18,
          longitudeDelta: 16,
        }}
        showsScale
        showsCompass
        loadingEnabled
        onPress={() => {
          // Dismiss open panels when tapping on empty map space
          if (showFilterPanel) setShowFilterPanel(false);
          if (showLegend) setShowLegend(false);
          if (showRegionalStats) setShowRegionalStats(false);
        }}
      >
        {/* Optional India outline */}
        {showOutline && (
          <Polygon
            coordinates={INDIA_OUTLINE}
            strokeColor="rgba(0,0,0,0.35)"
            fillColor="rgba(0,0,0,0.03)"
            strokeWidth={2}
            zIndex={1}
          />
        )}

        {/* Administrative Boundaries */}
        {showBoundaries && Array.isArray(BOUNDARIES) && BOUNDARIES.map(b => 
          b && b.coordinates && Array.isArray(b.coordinates) ? (
            <Polygon
              key={b.id}
              coordinates={b.coordinates}
              strokeColor="rgba(0,0,180,0.7)"
              fillColor="rgba(0,0,255,0.10)"
              strokeWidth={2}
              tappable={false}
              zIndex={2}
            />
          ) : null
        )}

        {/* Boundary Labels */}
        {showBoundaries && Array.isArray(boundaryStats) && boundaryStats.map(bs => 
          bs && bs.avg != null && bs.centroid ? (
            <Marker key={`bstat-${bs.id}`} coordinate={bs.centroid} tracksViewChanges={false} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.boundaryStat}>
                <Text style={styles.boundaryStatTitle}>{(bs.name || '').replace(' (demo)','')}</Text>
                <Text style={styles.boundaryStatValue}>{bs.avg.toFixed(2)} m</Text>
              </View>
            </Marker>
          ) : null
        )}

        {/* Recharge Zones with seasonal multiplier */}
        {showRecharge && Array.isArray(RECHARGE_ZONES) && RECHARGE_ZONES.map(zone => {
          if (!zone || !zone.coordinates || !Array.isArray(zone.coordinates)) return null;
          
          let multiplier = 1;
          switch (season) {
            case 'monsoon': multiplier = 1.8; break;
            case 'post-monsoon': multiplier = 1.2; break;
            case 'dry': multiplier = 0.6; break;
            default: multiplier = 1; // pre-monsoon
          }
          const effective = (zone.recharge || 0) * multiplier;
          const fill = effective < 2 ? 'rgba(255,0,0,0.30)'
            : effective < 4 ? 'rgba(255,165,0,0.30)'
            : 'rgba(0,180,0,0.40)';
          return (
            <Polygon
              key={zone.id}
              coordinates={zone.coordinates}
              strokeColor="rgba(0,0,0,0.35)"
              fillColor={fill}
              strokeWidth={1}
              zIndex={3}
            />
          );
        })}

        {/* Alerts */}
        {showAlerts && Array.isArray(filteredAlerts) && filteredAlerts.map(alert => {
          if (!alert || typeof alert.lat !== 'number' || typeof alert.long !== 'number') return null;
          
          const colors = severityColors[alert.severity] || severityColors.low;
          return (
            <Circle
              key={alert.id}
              center={{ latitude: alert.lat, longitude: alert.long }}
              radius={alert.radius || 10000}
              strokeColor={colors.stroke}
              fillColor={colors.fill}
              strokeWidth={2}
              zIndex={4}
            />
          );
        })}

        {/* Stations */}
        {showStations && Array.isArray(filteredStations) && filteredStations.map(renderStation).filter(Boolean)}

        {/* Trend Layer (approx heat spots) */}
        {showTrend && Array.isArray(filteredStations) && filteredStations.map(st => {
          if (!st || typeof st.lat !== 'number' || typeof st.long !== 'number') return null;
          
          const series = HISTORICAL_MAP[st.id] || [];
          const tr = classifyTrend(series);
          return (
            <Circle
              key={`trend-${st.id}`}
              center={{ latitude: st.lat, longitude: st.long }}
              radius={35000}
              strokeColor="transparent"
              fillColor={trendColor(tr)}
              zIndex={0}
            />
          );
        }).filter(Boolean)}
      </MapView>

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
              style={[styles.actionButton, showRegionalStats && styles.actionButtonActive]}
              onPress={() => setShowRegionalStats(!showRegionalStats)}
            >
              <Ionicons 
                name="stats-chart" 
                size={16} 
                color={showRegionalStats ? "#fff" : "#333"} 
                style={styles.actionIcon}
              />
              <Text style={[styles.actionButtonText, showRegionalStats && styles.actionButtonTextActive]}>Stats</Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionButton}
              onPress={centerOnAllStations}
            >
              <Ionicons 
                name="locate" 
                size={16} 
                color="#333" 
                style={styles.actionIcon}
              />
              <Text style={styles.actionButtonText}>Center</Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionButton}
              onPress={resetFilters}
            >
              <Ionicons 
                name="refresh" 
                size={16} 
                color="#333" 
                style={styles.actionIcon}
              />
              <Text style={styles.actionButtonText}>Reset</Text>
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
                  <LayerToggle label="Trend" active={showTrend} onPress={() => setShowTrend(v => !v)} />
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

              {/* Alert Filter */}
              <View style={styles.filterSection}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="warning" size={16} color="#333" />
                  <Text style={styles.filterSectionTitle}>Alert Filter</Text>
                </View>
                <AlertFilterToggle current={alertFilter} onChange={setAlertFilter} />
              </View>

              {/* Season & Real-time */}
              <View style={styles.filterSection}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="partly-sunny" size={16} color="#333" />
                  <Text style={styles.filterSectionTitle}>Season & Updates</Text>
                </View>
                <SeasonToggle current={season} onChange={setSeason} />
                <View style={styles.realTimeToggle}>
                  <LayerToggle 
                    label={realTimeOn ? 'Real-time: ON' : 'Real-time: OFF'} 
                    active={realTimeOn} 
                    onPress={() => setRealTimeOn(v => !v)} 
                  />
                </View>
              </View>

              {/* Favorites */}
              {Array.isArray(favorites) && favorites.length > 0 && (
                <View style={styles.filterSection}>
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name="star" size={16} color="#333" />
                    <Text style={styles.filterSectionTitle}>Favorite Stations</Text>
                  </View>
                  <View style={styles.favoritesList}>
                    {favorites.map(stationId => {
                      const station = Array.isArray(liveStations) ? 
                        liveStations.find(s => s && s.id === stationId) : null;
                      return station ? (
                        <Pressable 
                          key={stationId}
                          style={styles.favoriteItem}
                          onPress={() => focusOnStation(station)}
                        >
                          <Text style={styles.favoriteItemText}>{station.name || 'Unknown'}</Text>
                          <Text style={styles.favoriteItemLevel}>{station.waterLevel || 0}m</Text>
                        </Pressable>
                      ) : null;
                    }).filter(Boolean)}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Regional Statistics Panel */}
        {showRegionalStats && <RegionalStatsPanel regionalData={getRegionalStats()} />}

        {/* Interactive Legend */}
        {showLegend && <InteractiveLegend />}
      </View>
    </View>
  );
};

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

const AlertFilterToggle = ({ current, onChange }) => {
  const options = ['all', 'high', 'medium', 'low'];
  const colors = { high: '#ff4444', medium: '#ff8800', low: '#4488ff', all: '#666' };
  
  return (
    <View style={styles.alertFilterGroup}>
      {options.map(opt => (
        <Pressable 
          key={opt} 
          onPress={() => onChange(opt)} 
          style={[
            styles.alertFilterChip, 
            current === opt && styles.alertFilterChipActive,
            { borderColor: colors[opt] }
          ]}
        >
          <Text style={[
            styles.alertFilterChipText, 
            current === opt && styles.alertFilterChipTextActive,
            { color: current === opt ? '#fff' : colors[opt] }
          ]}>
            {opt.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};


const RegionalStatsPanel = ({ regionalData }) => (
  <View style={styles.statsOverviewPanel}>
    <Text style={styles.statsOverviewTitle}>DWLR Regional Overview</Text>
    
    <View style={styles.totalStatsRow}>
      <View style={styles.totalStatItem}>
        <Text style={styles.totalStatValue}>{regionalData.totals.total}</Text>
        <Text style={styles.totalStatLabel}>TOTAL STATIONS</Text>
      </View>
      <View style={styles.totalStatItem}>
        <Text style={[styles.totalStatValue, { color: '#ff4444' }]}>{regionalData.totals.low}</Text>
        <Text style={styles.totalStatLabel}>LOW</Text>
      </View>
      <View style={styles.totalStatItem}>
        <Text style={[styles.totalStatValue, { color: '#ff8800' }]}>{regionalData.totals.moderate}</Text>
        <Text style={styles.totalStatLabel}>MODERATE</Text>
      </View>
      <View style={styles.totalStatItem}>
        <Text style={[styles.totalStatValue, { color: '#44aa44' }]}>{regionalData.totals.high}</Text>
        <Text style={styles.totalStatLabel}>HIGH</Text>
      </View>
    </View>

    <ScrollView style={styles.regionScrollView}>
      {regionalData.regionStats.map(({ region, total, low, moderate, high }) => (
        <View key={region} style={styles.regionStatRow}>
          <Text style={styles.regionName}>{region}</Text>
          <View style={styles.regionStats}>
            <View style={styles.regionStatItem}>
              <Text style={styles.regionStatValue}>{total}</Text>
              <Text style={styles.regionStatLabel}>Total</Text>
            </View>
            <View style={styles.regionStatItem}>
              <Text style={[styles.regionStatValue, { color: '#ff4444' }]}>{low}</Text>
              <Text style={styles.regionStatLabel}>Low</Text>
            </View>
            <View style={styles.regionStatItem}>
              <Text style={[styles.regionStatValue, { color: '#ff8800' }]}>{moderate}</Text>
              <Text style={styles.regionStatLabel}>Mod</Text>
            </View>
            <View style={styles.regionStatItem}>
              <Text style={[styles.regionStatValue, { color: '#44aa44' }]}>{high}</Text>
              <Text style={styles.regionStatLabel}>High</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);

const InteractiveLegend = () => (
  <View style={styles.legendPanel}>
    <Text style={styles.legendTitle}>Map Legend</Text>
    
    <View style={styles.legendSection}>
      <Text style={styles.legendSectionTitle}>Water Level Markers</Text>
      <View style={styles.legendItem}>
        <View style={[styles.legendMarker, { backgroundColor: 'red' }]} />
        <Text style={styles.legendText}>Low (&lt; 2m)</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendMarker, { backgroundColor: 'orange' }]} />
        <Text style={styles.legendText}>Moderate (2-5m)</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendMarker, { backgroundColor: 'green' }]} />
        <Text style={styles.legendText}>High (&gt; 5m)</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendMarker, { backgroundColor: 'purple' }]} />
        <Text style={styles.legendText}>Selected Station</Text>
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
      <Text style={styles.legendTip}>• Tap stations for details and focus</Text>
      <Text style={styles.legendTip}>• Use star icon to bookmark favorites</Text>
      <Text style={styles.legendTip}>• Search by name or ID</Text>
      <Text style={styles.legendTip}>• Filter by water levels & alerts</Text>
    </View>
  </View>
);

// ------------------------------------------------------------
// Styles
// ------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Enhanced callout styles
  callout: { 
    backgroundColor: '#ffffff', 
    padding: 18, 
    borderRadius: 14, 
    minWidth: 220,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  calloutHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  calloutTitle: { 
    fontWeight: '800', 
    fontSize: 17,
    color: '#212529',
    flex: 1,
    letterSpacing: -0.2,
  },
  calloutText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 6,
    fontWeight: '500',
    lineHeight: 20,
  },
  calloutTrend: {
    fontSize: 13,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    fontWeight: '500',
  },
  favoriteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  focusButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  focusButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
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

  // Alert filter
  alertFilterGroup: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  alertFilterChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertFilterChipActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    transform: [{ scale: 0.98 }],
  },
  alertFilterChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  alertFilterChipTextActive: {
    color: '#ffffff',
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

  // Real-time toggle
  realTimeToggle: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },

  // Favorites
  favoritesList: {
    gap: 6,
    marginTop: 4,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fffbf0',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffd700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#fff4e6',
  },
  favoriteItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
  },
  favoriteItemLevel: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
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
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 1,
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

  // Regional Statistics Panel
  statsOverviewPanel: {
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 14,
    padding: 14,
    maxHeight: 330,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    marginTop: 4,
  },
  statsOverviewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
  },
  totalStatsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  totalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  totalStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 2,
  },
  totalStatLabel: {
    fontSize: 9,
    color: '#6c757d',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  regionScrollView: {
    maxHeight: 200,
  },
  regionStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    backgroundColor: '#fbfcfd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  regionName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#495057',
    minWidth: 70,
  },
  regionStats: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  regionStatItem: {
    alignItems: 'center',
  },
  regionStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212529',
  },
  regionStatLabel: {
    fontSize: 8,
    color: '#6c757d',
    fontWeight: '500',
    textTransform: 'uppercase',
  },

  // Boundary stats
  boundaryStat: { 
    backgroundColor: 'rgba(0,43,85,0.95)', 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderRadius: 12, 
    minWidth: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  boundaryStatTitle: { 
    color: '#ffffff', 
    fontSize: 11, 
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  boundaryStatValue: { 
    color: '#ffffff', 
    fontSize: 15, 
    fontWeight: '800',
    textAlign: 'center',
  },
});

export default MapScreen;
