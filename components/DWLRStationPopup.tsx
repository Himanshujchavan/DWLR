import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import BottomSheet from "@gorhom/bottom-sheet";
import {
  Activity,
  BarChart3,
  Battery,
  CloudRain,
  Droplets,
  Info,
  Layers,
  MapPin,
  Mountain,
  TrendingDown,
  TrendingUp
} from 'lucide-react-native';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

// Helper function to generate realistic station data
const makeStation = (
  id: string,
  name: string,
  lat: number,
  lng: number,
  waterLevel: number,
  depth: number,
  aquiferType: string,
  quality: string,
  waterQuality: { ph: number; tds: number; salinity: string }
) => {
  // Generate realistic variations based on location and quality
  const generateVariations = () => {
    const baseLevel = waterLevel;
    const isCoastal = (lng > 88 && lng < 93) || (lng > 72 && lng < 77 && lat < 20);
    const isArid = (lng > 70 && lng < 76 && lat > 23) || quality === 'Poor';
    
    // Trend calculation based on region and season (September)
    let trend: 'rising' | 'falling' | 'stable';
    let weeklyChange: number;
    let monthlyChange: number;
    
    if (isArid) {
      trend = Math.random() > 0.7 ? 'stable' : 'falling';
      weeklyChange = trend === 'falling' ? -(0.1 + Math.random() * 0.4) : 0;
      monthlyChange = trend === 'falling' ? -(0.5 + Math.random() * 1.5) : 0;
    } else if (isCoastal) {
      trend = Math.random() > 0.6 ? 'rising' : 'stable';
      weeklyChange = trend === 'rising' ? (0.05 + Math.random() * 0.25) : 0;
      monthlyChange = trend === 'rising' ? (0.3 + Math.random() * 0.8) : 0;
    } else {
      trend = Math.random() > 0.5 ? 'rising' : 'falling';
      weeklyChange = trend === 'rising' ? (0.1 + Math.random() * 0.3) : -(0.1 + Math.random() * 0.3);
      monthlyChange = trend === 'rising' ? (0.4 + Math.random() * 1.0) : -(0.4 + Math.random() * 1.0);
    }

    // Status based on water level and depth
    let status: 'safe' | 'semi-critical' | 'critical';
    const levelRatio = baseLevel / depth;
    if (levelRatio < 0.3) status = 'safe';
    else if (levelRatio < 0.6) status = 'semi-critical';
    else status = 'critical';

    // Rainfall variations based on region
    let rainfall: { today: number; thisWeek: number; thisMonth: number; seasonal: number };
    if (isArid) {
      rainfall = { today: 0, thisWeek: Math.floor(Math.random() * 20), thisMonth: Math.floor(50 + Math.random() * 80), seasonal: Math.floor(200 + Math.random() * 150) };
    } else if (isCoastal) {
      rainfall = { today: Math.floor(Math.random() * 15), thisWeek: Math.floor(40 + Math.random() * 60), thisMonth: Math.floor(180 + Math.random() * 120), seasonal: Math.floor(400 + Math.random() * 300) };
    } else {
      rainfall = { today: Math.floor(Math.random() * 10), thisWeek: Math.floor(30 + Math.random() * 50), thisMonth: Math.floor(120 + Math.random() * 100), seasonal: Math.floor(350 + Math.random() * 200) };
    }

    return { trend, weeklyChange, monthlyChange, status, rainfall };
  };

  const variations = generateVariations();
  const isCoastal = (lng > 88 && lng < 93) || (lng > 72 && lng < 77 && lat < 20);
  const isArid = (lng > 70 && lng < 76 && lat > 23) || quality === 'Poor';
  
  // Determine location string
  const getLocationString = () => {
    if (name.includes('Delhi')) return `${name}, Delhi`;
    if (name.includes('Mumbai')) return `${name}, Maharashtra`;
    if (name.includes('Chennai')) return `${name}, Tamil Nadu`;
    if (name.includes('Kolkata')) return `${name}, West Bengal`;
    if (name.includes('Bangalore')) return `${name}, Karnataka`;
    if (name.includes('Hyderabad')) return `${name}, Telangana`;
    if (name.includes('Ahmedabad') || name.includes('Surat')) return `${name}, Gujarat`;
    if (name.includes('Pune') || name.includes('Nagpur') || name.includes('Nashik')) return `${name}, Maharashtra`;
    if (name.includes('Jaipur') || name.includes('Jodhpur') || name.includes('Udaipur')) return `${name}, Rajasthan`;
    if (name.includes('Lucknow') || name.includes('Kanpur')) return `${name}, Uttar Pradesh`;
    if (name.includes('Bhopal') || name.includes('Indore') || name.includes('Gwalior')) return `${name}, Madhya Pradesh`;
    return `${name}, India`;
  };

  return {
    id,
    name,
    location: getLocationString(),
    coordinates: { lat, lng },
    
    // Groundwater data
    groundwater: {
      currentLevel: Number(waterLevel.toFixed(1)),
      previousLevel: Number((waterLevel - variations.weeklyChange).toFixed(1)),
      trend: variations.trend,
      status: variations.status,
      depth: depth,
      staticWaterLevel: Number((waterLevel + 2 + Math.random() * 3).toFixed(1)),
      lastUpdated: `${Math.floor(9 + Math.random() * 3)}:${Math.floor(10 + Math.random() * 50)} AM`,
      weeklyChange: Number(variations.weeklyChange.toFixed(1)),
      monthlyChange: Number(variations.monthlyChange.toFixed(1)),
    },
    
    // Aquifer data
    aquifer: {
      type: aquiferType === 'Alluvial' ? 'Unconfined' : aquiferType === 'Crystalline' ? 'Confined' : 'Semi-confined',
      thickness: Number((15 + Math.random() * 25).toFixed(1)),
      permeability: quality === 'Excellent' ? 'High' : quality === 'Good' ? 'Medium' : 'Low',
      yieldCapacity: `${Math.floor(80 + Math.random() * 200)} LPM`,
      transmissivity: `${Math.floor(150 + Math.random() * 300)} m²/day`,
      specificYield: Number((0.08 + Math.random() * 0.12).toFixed(2)),
      qualityIndex: quality,
    },
    
    // Soil data
    soil: {
      type: aquiferType === 'Alluvial' ? 'Sandy Loam' : aquiferType === 'Basaltic' ? 'Clay Loam' : 'Silty Clay',
      porosity: `${Math.floor(35 + Math.random() * 20)}%`,
      infiltrationRate: `${Math.floor(8 + Math.random() * 15)} mm/hr`,
      moistureContent: `${Math.floor(20 + Math.random() * 20)}%`,
      organicCarbon: `${(1.2 + Math.random() * 1.5).toFixed(1)}%`,
      pH: waterQuality.ph,
      electricalConductivity: `${(0.3 + Math.random() * 0.4).toFixed(2)} dS/m`,
    },
    
    // Rainfall data
    rainfall: {
      today: variations.rainfall.today,
      thisWeek: variations.rainfall.thisWeek,
      thisMonth: variations.rainfall.thisMonth,
      seasonal: variations.rainfall.seasonal,
      normal: Math.floor(variations.rainfall.seasonal * 0.85),
      lastRainfall: variations.rainfall.today > 0 ? 'Today' : `${Math.floor(1 + Math.random() * 7)} days ago`,
      intensity: variations.rainfall.thisWeek > 50 ? 'Heavy' : variations.rainfall.thisWeek > 25 ? 'Moderate' : 'Light',
    },
    
    // Recharge data
    recharge: {
      estimatedRate: `${Math.floor(40 + Math.random() * 60)} mm/year`,
      efficiency: `${Math.floor(60 + Math.random() * 30)}%`,
      contributingSources: isArid 
        ? ['Rainfall', 'Canal seepage'] 
        : isCoastal 
          ? ['Rainfall', 'River seepage', 'Urban runoff']
          : ['Rainfall', 'Canal seepage', 'Return flow'],
      rechargeIndex: quality === 'Excellent' ? 'High' : quality === 'Good' ? 'Moderate' : 'Low',
      potentialZone: quality === 'Excellent' ? 'High' : quality === 'Good' ? 'Moderate to High' : 'Low to Moderate',
      lastRechargeEvent: `${Math.floor(5 + Math.random() * 25)} days ago`,
    },
    
    // System status
    system: {
      batteryLevel: Math.floor(70 + Math.random() * 25),
      signalStrength: Math.floor(80 + Math.random() * 20),
      lastMaintenance: `${Math.floor(1 + Math.random() * 14)} days ago`,
      dataQuality: quality === 'Excellent' ? 'Excellent' : quality === 'Good' ? 'Good' : 'Fair',
      alerts: Math.random() > 0.7 ? ['Calibration due next week'] : [],
    }
  };
};

// Comprehensive DWLR stations across India
export const STATIONS = [
  // North Region - Delhi & NCR
  makeStation('DWLR_DEL_01', 'Delhi Central', 28.6139, 77.2090, 3.4, 40, 'Alluvial', 'Good', { ph: 7.5, tds: 920, salinity: 'Fresh' }),
  makeStation('DWLR_DEL_02', 'Gurgaon', 28.4595, 77.0266, 1.8, 35, 'Alluvial', 'Moderate', { ph: 7.8, tds: 1150, salinity: 'Fresh' }),
  makeStation('DWLR_GZB_01', 'Ghaziabad', 28.6692, 77.4538, 2.1, 32, 'Alluvial', 'Moderate', { ph: 7.3, tds: 980, salinity: 'Fresh' }),
  makeStation('DWLR_FAR_01', 'Faridabad', 28.4089, 77.3178, 1.9, 38, 'Alluvial', 'Poor', { ph: 7.6, tds: 1200, salinity: 'Brackish' }),
  
  // West Region - Maharashtra & Gujarat
  makeStation('DWLR_MUM_01', 'Mumbai Central', 19.0760, 72.8777, 1.5, 28, 'Basaltic', 'Poor', { ph: 6.9, tds: 1350, salinity: 'Brackish' }),
  makeStation('DWLR_PUN_01', 'Pune', 18.5204, 73.8567, 0.9, 26, 'Basaltic', 'Good', { ph: 7.2, tds: 750, salinity: 'Fresh' }),
  makeStation('DWLR_NGP_01', 'Nagpur', 21.1458, 79.0882, 5.1, 29, 'Crystalline', 'Excellent', { ph: 7.1, tds: 650, salinity: 'Fresh' }),
  makeStation('DWLR_AHD_01', 'Ahmedabad', 23.0225, 72.5714, 2.6, 34, 'Alluvial', 'Moderate', { ph: 7.4, tds: 1050, salinity: 'Fresh' }),
  makeStation('DWLR_SRT_01', 'Surat', 21.1702, 72.8311, 2.0, 31, 'Alluvial', 'Good', { ph: 7.0, tds: 800, salinity: 'Fresh' }),
  makeStation('DWLR_NAS_01', 'Nashik', 19.9975, 73.7898, 3.2, 33, 'Basaltic', 'Good', { ph: 7.3, tds: 720, salinity: 'Fresh' }),
  
  // South Region - Tamil Nadu, Karnataka, Andhra Pradesh
  makeStation('DWLR_CHN_01', 'Chennai', 13.0827, 80.2707, 4.8, 35, 'Crystalline', 'Moderate', { ph: 6.8, tds: 1250, salinity: 'Brackish' }),
  makeStation('DWLR_BLR_01', 'Bangalore', 12.9716, 77.5946, 5.2, 41, 'Crystalline', 'Good', { ph: 7.0, tds: 680, salinity: 'Fresh' }),
  makeStation('DWLR_HYD_01', 'Hyderabad', 17.3850, 78.4867, 5.6, 38, 'Crystalline', 'Excellent', { ph: 7.2, tds: 620, salinity: 'Fresh' }),
  makeStation('DWLR_CJB_01', 'Coimbatore', 11.0168, 76.9558, 6.2, 42, 'Crystalline', 'Excellent', { ph: 6.9, tds: 580, salinity: 'Fresh' }),
  makeStation('DWLR_TVM_01', 'Thiruvananthapuram', 8.5241, 76.9366, 3.9, 37, 'Sedimentary', 'Good', { ph: 6.7, tds: 780, salinity: 'Fresh' }),
  makeStation('DWLR_VZG_01', 'Visakhapatnam', 17.6868, 83.2185, 5.4, 39, 'Crystalline', 'Good', { ph: 7.1, tds: 890, salinity: 'Fresh' }),
  makeStation('DWLR_MDR_01', 'Madurai', 9.9252, 78.1198, 2.7, 36, 'Crystalline', 'Moderate', { ph: 6.8, tds: 950, salinity: 'Fresh' }),
  
  // East Region - West Bengal, Odisha, Jharkhand
  makeStation('DWLR_KOL_01', 'Kolkata', 22.5726, 88.3639, 1.9, 32, 'Alluvial', 'Poor', { ph: 7.8, tds: 1400, salinity: 'Brackish' }),
  makeStation('DWLR_RNC_01', 'Ranchi', 23.3441, 85.3096, 4.1, 27, 'Crystalline', 'Good', { ph: 6.9, tds: 720, salinity: 'Fresh' }),
  makeStation('DWLR_BBN_01', 'Bhubaneswar', 20.2961, 85.8245, 3.5, 34, 'Crystalline', 'Good', { ph: 7.0, tds: 810, salinity: 'Fresh' }),
  makeStation('DWLR_DHN_01', 'Dhanbad', 23.7957, 86.4304, 1.6, 29, 'Crystalline', 'Moderate', { ph: 7.2, tds: 980, salinity: 'Fresh' }),
  
  // Central Region - Madhya Pradesh, Uttar Pradesh
  makeStation('DWLR_BPL_01', 'Bhopal', 23.2599, 77.4126, 2.8, 31, 'Crystalline', 'Good', { ph: 7.1, tds: 850, salinity: 'Fresh' }),
  makeStation('DWLR_LKN_01', 'Lucknow', 26.8467, 80.9462, 3.1, 36, 'Alluvial', 'Moderate', { ph: 7.5, tds: 1080, salinity: 'Fresh' }),
  makeStation('DWLR_GWAL_01', 'Gwalior', 26.2183, 78.1828, 1.7, 33, 'Alluvial', 'Poor', { ph: 7.7, tds: 1320, salinity: 'Brackish' }),
  makeStation('DWLR_IND_01', 'Indore', 22.7196, 75.8577, 2.3, 35, 'Basaltic', 'Moderate', { ph: 7.0, tds: 920, salinity: 'Fresh' }),
  makeStation('DWLR_KAN_01', 'Kanpur', 26.4499, 80.3319, 1.4, 30, 'Alluvial', 'Poor', { ph: 7.8, tds: 1450, salinity: 'Brackish' }),
  
  // North East Region
  makeStation('DWLR_GHY_01', 'Guwahati', 26.1445, 91.7362, 1.3, 28, 'Alluvial', 'Moderate', { ph: 6.8, tds: 1100, salinity: 'Fresh' }),
  makeStation('DWLR_SHL_01', 'Shillong', 25.5788, 91.8933, 4.9, 24, 'Crystalline', 'Excellent', { ph: 6.5, tds: 420, salinity: 'Fresh' }),
  makeStation('DWLR_IMP_01', 'Imphal', 24.8170, 93.9368, 2.4, 22, 'Sedimentary', 'Good', { ph: 6.7, tds: 680, salinity: 'Fresh' }),
  makeStation('DWLR_AGT_01', 'Agartala', 23.8315, 91.2868, 3.6, 25, 'Sedimentary', 'Good', { ph: 6.9, tds: 750, salinity: 'Fresh' }),
  
  // Rajasthan Region
  makeStation('DWLR_JAI_01', 'Jaipur', 26.9124, 75.7873, 2.2, 30, 'Crystalline', 'Moderate', { ph: 7.6, tds: 1200, salinity: 'Fresh' }),
  makeStation('DWLR_JDH_01', 'Jodhpur', 26.2389, 73.0243, 1.1, 28, 'Crystalline', 'Poor', { ph: 8.1, tds: 1850, salinity: 'Saline' }),
  makeStation('DWLR_UDR_01', 'Udaipur', 24.5854, 73.7125, 2.9, 32, 'Crystalline', 'Good', { ph: 7.4, tds: 980, salinity: 'Fresh' }),
];

// Default station data (Nagpur Central for demo)
const mockStationData = STATIONS.find(station => station.id === 'DWLR_NGP_01') || STATIONS[0];

export const getStationById = (id: string) => STATIONS.find((s) => s.id === id);

// Helper function to get stations by region
export const getStationsByRegion = (region: 'north' | 'south' | 'east' | 'west' | 'central' | 'northeast' | 'rajasthan') => {
  const regionFilters = {
    north: (id: string) => id.includes('DEL_') || id.includes('GZB_') || id.includes('FAR_'),
    south: (id: string) => id.includes('CHN_') || id.includes('BLR_') || id.includes('HYD_') || id.includes('CJB_') || id.includes('TVM_') || id.includes('VZG_') || id.includes('MDR_'),
    east: (id: string) => id.includes('KOL_') || id.includes('RNC_') || id.includes('BBN_') || id.includes('DHN_'),
    west: (id: string) => id.includes('MUM_') || id.includes('PUN_') || id.includes('NGP_') || id.includes('AHD_') || id.includes('SRT_') || id.includes('NAS_'),
    central: (id: string) => id.includes('BPL_') || id.includes('LKN_') || id.includes('GWAL_') || id.includes('IND_') || id.includes('KAN_'),
    northeast: (id: string) => id.includes('GHY_') || id.includes('SHL_') || id.includes('IMP_') || id.includes('AGT_'),
    rajasthan: (id: string) => id.includes('JAI_') || id.includes('JDH_') || id.includes('UDR_'),
  };
  
  return STATIONS.filter(station => regionFilters[region](station.id));
};

export interface DWLRStationPopupRef {
  expand: () => void;
  close: () => void;
  snapToIndex: (index: number) => void;
}

interface Props {
  stationData?: typeof mockStationData | null;
  variant?: 'light' | 'dark';
  isVisible?: boolean;
  onClose?: () => void;
}

const DWLRStationPopup = forwardRef<DWLRStationPopupRef, Props>(({ 
  stationData: propStationData,
  variant = 'light',
  isVisible = false,
  onClose
}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();
  const isDark = variant === 'dark' || colorScheme === 'dark';
  // Ensure we always have a valid station object even if null is passed in
  const stationData = propStationData ?? mockStationData;
  
  // Debug logging
  console.log('🔍 DWLRStationPopup render:', { 
    hasStationData: !!propStationData, 
    isVisible, 
    stationName: propStationData?.name || 'None' 
  });
  
  // Snap points for different content heights - using percentages for better reliability
  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);

  // Handle visibility changes
  useEffect(() => {
    console.log('📱 DWLRStationPopup visibility changed:', { isVisible, hasStationData: !!propStationData });
    // Don't need to manually animate since we're using the index prop now
  }, [isVisible, propStationData]);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    expand: () => {
      console.log('📱 BottomSheet expand called');
      bottomSheetRef.current?.expand();
    },
    close: () => {
      console.log('📱 BottomSheet close called');
      bottomSheetRef.current?.close();
    },
    snapToIndex: (index: number) => {
      console.log('📱 BottomSheet snapToIndex called:', index);
      bottomSheetRef.current?.snapToIndex(index);
    },
  }));

  // Color scheme
  const colors = {
    background: isDark ? '#1a1a1a' : Colors.light.cardBackground,
    surface: isDark ? '#2a2a2a' : '#f8f9fa',
    text: isDark ? '#ffffff' : Colors.light.text,
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textSecondary,
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af',
    primary: isDark ? Colors.dark.primary : Colors.light.primary,
    secondary: isDark ? Colors.dark.secondary : Colors.light.secondary,
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.cardBorder,
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'rising' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'rising' ? colors.success : colors.danger;
  };

  const renderHeader = () => {
    if (!stationData || !stationData.groundwater) return null;
    const TrendIcon = getTrendIcon(stationData.groundwater.trend);
    const trendColor = getTrendColor(stationData.groundwater.trend);

    return (
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        {/* Main Station Info */}
        <View style={styles.headerTop}>
          <View style={styles.stationInfo}>
            <Text style={[styles.stationName, { color: colors.text }]}>
              {stationData?.name}
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                {stationData?.location}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Key Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>Current Level</Text>
            <Text style={[styles.metricValue, { color: colors.primary }]}>
              {stationData.groundwater.currentLevel}m
            </Text>
            <Text style={[styles.metricSubtitle, { color: colors.textMuted }]}>BGL</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.metricTitle, { color: colors.textSecondary }]} numberOfLines={2}>Avg Ground Level</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stationData.groundwater.staticWaterLevel}m
            </Text>
            <Text style={[styles.metricSubtitle, { color: colors.textMuted }]}>Static</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>Change</Text>
            <View style={styles.trendContainer}>
              <TrendIcon size={16} color={trendColor} />
              <Text style={[styles.metricValue, { color: trendColor, fontSize: 16 }]}>
                {Math.abs(stationData.groundwater.weeklyChange)}m
              </Text>
            </View>
            <Text style={[styles.metricSubtitle, { color: colors.textMuted }]}>This Week</Text>
          </View>
        </View>
        
        <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
          Last updated: {stationData.groundwater.lastUpdated}
        </Text>
      </View>
    );
  };

  const renderDataCard = (
    title: string, 
    icon: any, 
    iconColor: string, 
    children: React.ReactNode
  ) => (
    <View style={[styles.dataCard, { 
      backgroundColor: colors.surface,
      borderColor: colors.border 
    }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconContainer, { backgroundColor: iconColor + '15' }]}>
          {React.createElement(icon, { size: 20, color: iconColor })}
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  const renderDataGrid = (data: { label: string; value: string; highlight?: boolean; unit?: string }[]) => (
    <View style={styles.dataGrid}>
      {data.map((item, index) => (
        <View key={index} style={styles.gridItem}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{item.label}</Text>
          <View style={styles.gridValueContainer}>
            <Text style={[
              styles.gridValue, 
              { color: item.highlight ? colors.primary : colors.text }
            ]}>
              {item.value}
            </Text>
            {item.unit && (
              <Text style={[styles.gridUnit, { color: colors.textMuted }]}>{item.unit}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );



  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={propStationData ? 1 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      onChange={(index) => {
        console.log('📱 BottomSheet index changed:', index);
        if (index === -1 && onClose) {
          onClose();
        }
      }}
      onClose={() => {
        console.log('📱 BottomSheet closed');
        if (onClose) {
          onClose();
        }
      }}
    >
      <View style={styles.container}>
        {/* Only show content if we have real station data */}
        {propStationData ? (
          <>
            {renderHeader()}
            
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* DWLR Details */}
              {renderDataCard('DWLR Details', Droplets, colors.primary, 
                renderDataGrid([
                  { label: 'Rainfall (Month)', value: `${stationData.rainfall.thisMonth}`, unit: 'mm', highlight: true },
                  { label: 'Aquifer Type', value: stationData.aquifer.type },
                  { label: 'Recharge Rate', value: stationData.recharge.estimatedRate, highlight: true },
                  { label: 'Soil Type', value: stationData.soil.type },
                ])
              )}

              {/* Aquifer Information */}
              {renderDataCard('Aquifer Information', Layers, '#8b5cf6', 
                renderDataGrid([
                  { label: 'Type', value: stationData.aquifer.type },
                  { label: 'Thickness', value: `${stationData.aquifer.thickness}`, unit: 'm' },
                  { label: 'Permeability', value: stationData.aquifer.permeability },
                  { label: 'Yield Capacity', value: stationData.aquifer.yieldCapacity, highlight: true },
                  { label: 'Transmissivity', value: stationData.aquifer.transmissivity },
                  { label: 'Quality Index', value: stationData.aquifer.qualityIndex, highlight: true },
                ])
              )}

              {/* Environmental Data */}
              <View style={styles.environmentalSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Environmental Conditions</Text>
                
                <View style={styles.environmentalCards}>
                  {/* Soil Properties - Compact */}
                  <View style={[styles.compactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.compactHeader}>
                      <Mountain size={16} color="#a855f7" />
                      <Text style={[styles.compactTitle, { color: colors.text }]}>Soil Properties</Text>
                    </View>
                    {renderDataGrid([
                      { label: 'Type', value: stationData.soil.type },
                      { label: 'Porosity', value: stationData.soil.porosity },
                      { label: 'pH Level', value: stationData.soil.pH.toString(), highlight: true },
                      { label: 'Infiltration', value: stationData.soil.infiltrationRate, highlight: true },
                    ])}
                  </View>

                  {/* Rainfall Data - Compact */}
                  <View style={[styles.compactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.compactHeader}>
                      <CloudRain size={16} color="#06b6d4" />
                      <Text style={[styles.compactTitle, { color: colors.text }]}>Rainfall Data</Text>
                    </View>
                    {renderDataGrid([
                      { label: 'Today', value: `${stationData.rainfall.today}`, unit: 'mm' },
                      { label: 'This Week', value: `${stationData.rainfall.thisWeek}`, unit: 'mm' },
                      { label: 'This Month', value: `${stationData.rainfall.thisMonth}`, unit: 'mm', highlight: true },
                      { label: 'Seasonal', value: `${stationData.rainfall.seasonal}`, unit: 'mm', highlight: true },
                    ])}
                  </View>
                </View>
              </View>

              {/* Recharge Information */}
              {renderDataCard('Recharge Information', Activity, '#10b981', (
                <View>
                  {renderDataGrid([
                    { label: 'Estimated Rate', value: stationData.recharge.estimatedRate, highlight: true },
                    { label: 'Efficiency', value: stationData.recharge.efficiency },
                    { label: 'Recharge Index', value: stationData.recharge.rechargeIndex, highlight: true },
                    { label: 'Potential Zone', value: stationData.recharge.potentialZone },
                  ])}
                  
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                  <Text style={[styles.sourcesTitle, { color: colors.text }]}>
                    Contributing Sources:
                  </Text>
                  <View style={styles.sourcesList}>
                    {stationData?.recharge?.contributingSources?.map((source, index) => (
                      <View key={index} style={[styles.sourceTag, { 
                        backgroundColor: colors.primary + '15',
                        borderColor: colors.primary + '30'
                      }]}>
                        <Text style={[styles.sourceText, { color: colors.primary }]}>
                          {source}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              {/* System Status */}
              {renderDataCard('System Status', BarChart3, '#f59e0b', (
                <View>
                  <View style={styles.systemMetrics}>
                    <View style={styles.metricItem}>
                      <Battery size={16} color={colors.success} />
                      <Text style={[styles.metricText, { color: colors.text }]}>
                        Battery: {stationData?.system?.batteryLevel ?? '--'}%
                      </Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Activity size={16} color={colors.primary} />
                      <Text style={[styles.metricText, { color: colors.text }]}>
                        Signal: {stationData?.system?.signalStrength ?? '--'}%
                      </Text>
                    </View>
                  </View>
                  
                  {renderDataGrid([
                    { label: 'Data Quality', value: stationData.system.dataQuality, highlight: true },
                    { label: 'Last Maintenance', value: stationData.system.lastMaintenance },
                  ])}
                  
                  {stationData?.system?.alerts?.length > 0 && (
                    <View style={styles.alertsSection}>
                      <Text style={[styles.alertsTitle, { color: colors.warning }]}>
                        System Alerts
                      </Text>
                      {stationData.system.alerts.map((alert, index) => (
                        <View key={index} style={[styles.alertItem, { 
                          backgroundColor: colors.warning + '15' 
                        }]}>
                          <Info size={16} color={colors.warning} />
                          <Text style={[styles.alertText, { color: colors.text }]}>
                            {alert}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {/* Bottom padding for scroll */}
              <View style={{ height: 80 }} />
            </ScrollView>
          </>
        ) : (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
            <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
              Select a DWLR station to view details
            </Text>
          </View>
        )}
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  stationInfo: {
    flex: 1,
    paddingRight: 12,
  },
  stationName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  location: {
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  
  // New metric cards layout
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    minHeight: 70,
    justifyContent: 'center',
  },
  metricTitle: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 12,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  metricSubtitle: {
    fontSize: 10,
    textAlign: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastUpdated: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  dataCard: {
    borderRadius: 12,
    padding: 16,
    paddingBottom: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    flex: 1,
  },
  cardContent: {
    gap: 8,
    paddingBottom: 4,
  },
  
  // Data grid styles
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 60,
  },
  gridItemLeft: {
    // Remove margin for better flex layout
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    lineHeight: 16,
    color: '#64748b',
  },
  gridValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    flexShrink: 1,
  },
  gridUnit: {
    fontSize: 11,
    marginLeft: 2,
    lineHeight: 14,
  },

  // Environmental section
  environmentalSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  environmentalCards: {
    flexDirection: 'row',
    gap: 12,
  },
  compactCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    marginVertical: 12,
  },
  sourcesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  sourcesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  systemMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertsSection: {
    marginTop: 12,
  },
  alertsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  alertText: {
    fontSize: 12,
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

DWLRStationPopup.displayName = 'DWLRStationPopup';

export default DWLRStationPopup;
