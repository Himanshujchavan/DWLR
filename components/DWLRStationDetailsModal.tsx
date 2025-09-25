import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    Activity,
    BarChart3,
    Battery,
    Clock,
    CloudRain,
    Download,
    Droplets,
    FileText,
    Gauge,
    Info,
    Layers,
    MapPin,
    Thermometer,
    TrendingDown,
    TrendingUp,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
  visible: boolean;
  stationData: any;
  onClose: () => void;
  variant?: 'light' | 'dark';
}

const DWLRStationDetailsModal: React.FC<Props> = ({ 
  visible, 
  stationData, 
  onClose, 
  variant = 'light' 
}) => {
  const colorScheme = useColorScheme();
  const isDark = variant === 'dark' || colorScheme === 'dark';
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  // Download options - Enhanced with new data categories
  const downloadOptions = [
    { 
      id: 'complete', 
      label: 'Complete Station Report', 
      format: 'PDF', 
      icon: FileText,
      description: 'Full comprehensive report with all monitoring data',
      size: '2.5 MB'
    },
    { 
      id: 'groundwater', 
      label: 'Groundwater DWLR Data', 
      format: 'CSV', 
      icon: Droplets,
      description: 'Time series water level measurements',
      size: '450 KB'
    },
    { 
      id: 'environmental', 
      label: 'Environmental Monitoring', 
      format: 'Excel', 
      icon: CloudRain,
      description: 'Soil, weather, and climate data analysis',
      size: '680 KB'
    },
    { 
      id: 'telemetry', 
      label: 'Telemetry & System Data', 
      format: 'JSON', 
      icon: Activity,
      description: 'System status, battery, and communication logs',
      size: '125 KB'
    },
    { 
      id: 'aquifer', 
      label: 'Aquifer Information', 
      format: 'PDF', 
      icon: Layers,
      description: 'Geological and hydrogeological parameters',
      size: '890 KB'
    },
    { 
      id: 'recharge', 
      label: 'Recharge Analysis', 
      format: 'Excel', 
      icon: TrendingUp,
      description: 'Groundwater recharge estimation and trends',
      size: '320 KB'
    },
    { 
      id: 'timeseries', 
      label: 'Time Series Dataset', 
      format: 'CSV', 
      icon: Clock,
      description: 'Historical data with timestamps',
      size: '1.2 MB'
    },
    { 
      id: 'location', 
      label: 'Station Metadata', 
      format: 'JSON', 
      icon: MapPin,
      description: 'Location coordinates and installation details',
      size: '45 KB'
    },
  ];

  const handleDownload = (optionId: string, format: string, label: string, size: string) => {
    // Enhanced download functionality with progress simulation
    const downloadData = {
      complete: 'Generating comprehensive PDF report with all station data...',
      groundwater: 'Exporting water level time series data to CSV format...',
      environmental: 'Compiling soil, weather, and climate data to Excel workbook...',
      telemetry: 'Extracting system status and telemetry logs to JSON...',
      aquifer: 'Creating detailed aquifer analysis PDF report...',
      recharge: 'Processing groundwater recharge calculations to Excel...',
      timeseries: 'Exporting complete historical dataset to CSV...',
      location: 'Gathering station metadata and coordinates to JSON...',
    };

    Alert.alert(
      'Download Initiated',
      `${downloadData[optionId as keyof typeof downloadData]}\n\nFile: ${label}\nFormat: ${format}\nSize: ${size}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            setShowDownloadOptions(false);
            // Here you would implement actual download logic
            setTimeout(() => {
              Alert.alert('Download Complete', `${label} has been saved to Downloads folder.`);
            }, 2000);
          } 
        }
      ]
    );
  };

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

  if (!stationData) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {stationData.name} - Detailed Information
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.downloadButton, { backgroundColor: colors.primary + '15' }]}
                onPress={() => setShowDownloadOptions(!showDownloadOptions)}
                activeOpacity={0.7}
              >
                <Download size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Download Options - Enhanced with Overlay */}
          {showDownloadOptions && (
            <>
              {/* Overlay to close dropdown when clicking outside */}
              <TouchableOpacity
                style={styles.downloadOverlay}
                activeOpacity={1}
                onPress={() => setShowDownloadOptions(false)}
              />
              <View style={[styles.downloadOptions, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={styles.downloadOptionsHeaderContainer}>
                  <Text style={[styles.downloadOptionsHeader, { color: colors.text }]}>
                    Download Station Data
                  </Text>
                  <TouchableOpacity
                    style={styles.downloadCloseButton}
                    onPress={() => setShowDownloadOptions(false)}
                    activeOpacity={0.7}
                  >
                    <X size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <ScrollView 
                  style={styles.downloadOptionsScroll}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                >
                  {downloadOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[styles.downloadOption, { borderBottomColor: colors.border }]}
                      onPress={() => handleDownload(option.id, option.format, option.label, option.size)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.downloadOptionContent}>
                        <View style={[styles.downloadOptionIcon, { backgroundColor: colors.primary + '15' }]}>
                          <option.icon size={18} color={colors.primary} />
                        </View>
                        <View style={styles.downloadOptionInfo}>
                          <View style={styles.downloadOptionHeader}>
                            <Text style={[styles.downloadOptionLabel, { color: colors.text }]}>
                              {option.label}
                            </Text>
                            <View style={styles.downloadOptionMeta}>
                              <Text style={[styles.downloadOptionFormat, { color: colors.primary }]}>
                                {option.format}
                              </Text>
                              <Text style={[styles.downloadOptionSize, { color: colors.textMuted }]}>
                                {option.size}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.downloadOptionDescription, { color: colors.textSecondary }]}>
                            {option.description}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                {/* Download All Button */}
                <TouchableOpacity
                  style={[styles.downloadAllButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    Alert.alert(
                      'Download All Data',
                      'This will download all available data in a compressed ZIP file (~5.2 MB). Continue?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Download All', 
                          onPress: () => {
                            setShowDownloadOptions(false);
                            Alert.alert('Download Started', 'Preparing comprehensive data package...');
                          }
                        }
                      ]
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <Download size={18} color="white" />
                  <Text style={styles.downloadAllText}>
                    Download All Data (ZIP)
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Station Overview Cards */}
          <View style={styles.overviewSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Station Overview</Text>
            <View style={styles.overviewCards}>
              <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.overviewCardTitle, { color: colors.textSecondary }]}>Current Status</Text>
                <Text style={[styles.overviewCardValue, { color: colors.primary }]}>
                  {stationData.groundwater.status?.toUpperCase() || 'ACTIVE'}
                </Text>
              </View>
              <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.overviewCardTitle, { color: colors.textSecondary }]}>Water Level</Text>
                <Text style={[styles.overviewCardValue, { color: colors.text }]}>
                  {stationData.groundwater.currentLevel}m
                </Text>
              </View>
              <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.overviewCardTitle, { color: colors.textSecondary }]}>Quality Index</Text>
                <Text style={[styles.overviewCardValue, { color: colors.success }]}>
                  {stationData.aquifer.qualityIndex}
                </Text>
              </View>
            </View>
          </View>

          {/* Groundwater Level Details - Enhanced DWLR Section */}
          <View style={styles.monitoringSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#0ea5e915' }]}>
                <Droplets size={18} color="#0ea5e9" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Groundwater Monitoring (DWLR)</Text>
            </View>
            
            {/* Station Location & Metadata */}
            <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Station Location & Metadata</Text>
              </View>
              <View style={styles.cardContent}>
                {renderDataGrid([
                  { label: 'Station ID', value: stationData.stationId || 'DWLR-001', highlight: true },
                  { label: 'Well ID', value: stationData.wellId || 'WL-2024-001', highlight: true },
                  { label: 'Latitude', value: `${stationData.latitude || '20.5937'}°N` },
                  { label: 'Longitude', value: `${stationData.longitude || '78.9629'}°E` },
                  { label: 'Ground Elevation', value: `${stationData.groundElevation || '420'}`, unit: 'm MSL' },
                  { label: 'Installation Date', value: stationData.installationDate || '2024-01-15' },
                ])}
              </View>
            </View>

            {/* Current Water Level Card */}
            <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Water Level Monitoring</Text>
              </View>
              <View style={styles.cardContent}>
                {/* Real-time Level Metrics */}
                <View style={styles.levelMetrics}>
                  <View style={styles.levelMetricItem}>
                    <Text style={[styles.levelMetricLabel, { color: colors.textSecondary }]}>Current Level</Text>
                    <Text style={[styles.levelMetricValue, { color: colors.text }]}>
                      {stationData.groundwater?.currentLevel || '12.5'}m
                    </Text>
                    <Text style={[styles.levelMetricUnit, { color: colors.textMuted }]}>below ground</Text>
                  </View>
                  <View style={styles.levelMetricItem}>
                    <Text style={[styles.levelMetricLabel, { color: colors.textSecondary }]}>24h Change</Text>
                    <View style={styles.changeIndicator}>
                      {(stationData.groundwater?.dailyChange || 0.1) > 0 ? (
                        <TrendingUp size={14} color={colors.success} />
                      ) : (
                        <TrendingDown size={14} color={colors.danger} />
                      )}
                      <Text style={[styles.levelMetricValue, { 
                        color: (stationData.groundwater?.dailyChange || 0.1) > 0 ? colors.success : colors.danger 
                      }]}>
                        {Math.abs(stationData.groundwater?.dailyChange || 0.1)}m
                      </Text>
                    </View>
                  </View>
                </View>
                
                {renderDataGrid([
                  { label: 'Measuring Interval', value: stationData.groundwater?.frequency || 'Hourly', highlight: true },
                  { label: 'Last Reading', value: stationData.groundwater?.lastUpdated || '14:30:00' },
                  { label: 'Max Recorded', value: `${stationData.groundwater?.maxLevel || '15.8'}m` },
                  { label: 'Min Recorded', value: `${stationData.groundwater?.minLevel || '8.2'}m` },
                  { label: 'Monthly Avg', value: `${stationData.groundwater?.monthlyAverage || '11.3'}m` },
                  { label: 'Data Quality', value: stationData.system?.dataQuality || 'Excellent', highlight: true },
                ])}
              </View>
            </View>

            {/* Environmental Corrections & Measurements */}
            <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Environmental Corrections</Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.environmentalMetrics}>
                  <View style={styles.environmentalMetricItem}>
                    <Gauge size={16} color="#06b6d4" />
                    <Text style={[styles.environmentalMetricLabel, { color: colors.textSecondary }]}>
                      Pressure
                    </Text>
                    <Text style={[styles.environmentalMetricValue, { color: colors.text }]}>
                      {stationData.environmental?.barometricPressure || '1013'} hPa
                    </Text>
                  </View>
                  <View style={styles.environmentalMetricItem}>
                    <Thermometer size={16} color="#ef4444" />
                    <Text style={[styles.environmentalMetricLabel, { color: colors.textSecondary }]}>
                      Water Temp
                    </Text>
                    <Text style={[styles.environmentalMetricValue, { color: colors.text }]}>
                      {stationData.environmental?.waterTemp || '22.5'}°C
                    </Text>
                  </View>
                </View>

                {renderDataGrid([
                  { label: 'Ambient Temp', value: `${stationData.environmental?.ambientTemp || '28'}°C` },
                  { label: 'Humidity', value: `${stationData.environmental?.humidity || '65'}%` },
                  { label: 'Pressure Correction', value: stationData.environmental?.pressureCorrection || 'Applied' },
                  { label: 'Temp Correction', value: stationData.environmental?.tempCorrection || 'Applied' },
                ])}
              </View>
            </View>

            {/* Time Series & Data Continuity */}
            <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Time Series Analysis</Text>
              </View>
              <View style={styles.cardContent}>
                {renderDataGrid([
                  { label: '24h Data', value: `${stationData.timeSeries?.dataPoints24h || '24'}`, highlight: true },
                  { label: 'Weekly', value: `${stationData.timeSeries?.dataPointsWeekly || '168'}` },
                  { label: 'Monthly', value: `${stationData.timeSeries?.dataPointsMonthly || '720'}` },
                  { label: 'Completeness', value: `${stationData.timeSeries?.completeness || '98.5'}`, unit: '%', highlight: true },
                  { label: 'First Reading', value: stationData.timeSeries?.firstReading || '2024-01-15 00:00:00' },
                  { label: 'Operation', value: `${stationData.timeSeries?.operationDays || '254'} days` },
                ])}
              </View>
            </View>

            {/* Telemetry Status */}
            <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Telemetry Status</Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.telemetryMetrics}>
                  <View style={styles.telemetryItem}>
                    <Battery size={16} color={colors.success} />
                    <Text style={[styles.telemetryLabel, { color: colors.textSecondary }]}>Battery</Text>
                    <Text style={[styles.telemetryValue, { color: colors.success }]}>
                      {stationData.system?.batteryLevel || '89'}%
                    </Text>
                  </View>
                  <View style={styles.telemetryItem}>
                    <Activity size={16} color={colors.primary} />
                    <Text style={[styles.telemetryLabel, { color: colors.textSecondary }]}>Signal</Text>
                    <Text style={[styles.telemetryValue, { color: colors.primary }]}>
                      {stationData.system?.signalStrength || '4/5'} bars
                    </Text>
                  </View>
                </View>

                {renderDataGrid([
                  { label: 'Communication', value: stationData.telemetry?.commType || 'GSM/GPRS', highlight: true },
                  { label: 'Network', value: stationData.telemetry?.networkOperator || 'Airtel' },
                  { label: 'Transmission', value: stationData.telemetry?.transmissionInterval || 'Every 15 min' },
                  { label: 'Last Data', value: stationData.telemetry?.lastTransmission || '2024-09-26 14:45:00', highlight: true },
                  { label: 'Solar Status', value: stationData.telemetry?.solarStatus || 'Charging' },
                  { label: 'Next Maintenance', value: stationData.telemetry?.nextMaintenance || '2024-12-15' },
                ])}
              </View>
            </View>
          </View>

          {/* Monitoring Sections */}
          <View style={styles.monitoringSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Layers size={18} color={colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Aquifer Monitoring</Text>
            </View>
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
          </View>

          <View style={styles.monitoringSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#10b98115' }]}>
                <CloudRain size={18} color="#10b981" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Environmental Monitoring</Text>
            </View>
            
            {/* Soil Properties Card - Enhanced */}
            <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Soil Properties Analysis</Text>
              </View>
              <View style={styles.cardContent}>
                {/* Soil Type & Classification */}
                <View style={styles.soilTypeSection}>
                  <Text style={[styles.subSectionTitle, { color: colors.text }]}>
                    Soil Classification
                  </Text>
                  <View style={styles.soilTypeInfo}>
                    <Text style={[styles.soilTypeValue, { color: colors.primary }]}>
                      {stationData.soil?.type || 'Clay Loam'}
                    </Text>
                    <Text style={[styles.soilDescription, { color: colors.textSecondary }]}>
                      Primary soil composition at monitoring depth
                    </Text>
                  </View>
                </View>

                {renderDataGrid([
                  { label: 'Porosity', value: stationData.soil?.porosity || '45%', highlight: true },
                  { label: 'pH Level', value: stationData.soil?.pH?.toString() || '6.8', highlight: true },
                  { label: 'Infiltration Rate', value: stationData.soil?.infiltrationRate || '12.5 mm/hr' },
                  { label: 'Permeability', value: stationData.soil?.permeability || 'Moderate' },
                  { label: 'Organic Content', value: stationData.soil?.organicContent || '3.2%' },
                  { label: 'Bulk Density', value: `${stationData.soil?.bulkDensity || '1.35'} g/cm³` },
                ])}
              </View>
            </View>

            {/* Weather & Climate Card - Enhanced */}
            <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Weather & Rainfall</Text>
              </View>
              <View style={styles.cardContent}>
                {/* Current Weather Conditions */}
                <View style={styles.weatherSection}>
                  <Text style={[styles.subSectionTitle, { color: colors.text }]}>
                    Current Conditions
                  </Text>
                  <View style={styles.weatherMetrics}>
                    <View style={styles.weatherMetricItem}>
                      <Thermometer size={16} color="#ef4444" />
                      <Text style={[styles.weatherLabel, { color: colors.textSecondary }]}>Temperature</Text>
                      <Text style={[styles.weatherValue, { color: colors.text }]}>
                        {stationData.environmental?.ambientTemp || '28.3'}°C
                      </Text>
                    </View>
                    <View style={styles.weatherMetricItem}>
                      <Gauge size={16} color="#06b6d4" />
                      <Text style={[styles.weatherLabel, { color: colors.textSecondary }]}>Humidity</Text>
                      <Text style={[styles.weatherValue, { color: colors.text }]}>
                        {stationData.environmental?.humidity || '65'}%
                      </Text>
                    </View>
                    <View style={styles.weatherMetricItem}>
                      <Activity size={16} color="#8b5cf6" />
                      <Text style={[styles.weatherLabel, { color: colors.textSecondary }]}>Pressure</Text>
                      <Text style={[styles.weatherValue, { color: colors.text }]}>
                        {stationData.environmental?.barometricPressure || '1013.2'} hPa
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Rainfall Data */}
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
                <Text style={[styles.subSectionTitle, { color: colors.text }]}>
                  Rainfall Statistics
                </Text>
                {renderDataGrid([
                  { label: 'Today', value: `${stationData.rainfall?.today || '2.5'}`, unit: 'mm', highlight: true },
                  { label: 'This Week', value: `${stationData.rainfall?.thisWeek || '15.8'}`, unit: 'mm' },
                  { label: 'This Month', value: `${stationData.rainfall?.thisMonth || '125.3'}`, unit: 'mm', highlight: true },
                  { label: 'Seasonal Total', value: `${stationData.rainfall?.seasonal || '678.9'}`, unit: 'mm', highlight: true },
                  { label: 'Average Annual', value: `${stationData.rainfall?.annualAverage || '1200'}`, unit: 'mm' },
                  { label: 'Rainy Days (Month)', value: `${stationData.rainfall?.rainyDays || '12'} days` },
                ])}
              </View>
            </View>

            {/* Environmental Impact Assessment */}
            <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Environmental Impact</Text>
              </View>
              <View style={styles.cardContent}>
                {/* Impact Indicators */}
                <View style={styles.impactSection}>
                  <View style={styles.impactItem}>
                    <View style={[styles.impactIndicator, { backgroundColor: colors.success + '15' }]}>
                      <Text style={[styles.impactLabel, { color: colors.textSecondary }]}>
                        Groundwater Recharge Potential
                      </Text>
                      <Text style={[styles.impactValue, { color: colors.success }]}>
                        {stationData.environmental?.rechargeImpact || 'HIGH'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.impactItem}>
                    <View style={[styles.impactIndicator, { backgroundColor: colors.warning + '15' }]}>
                      <Text style={[styles.impactLabel, { color: colors.textSecondary }]}>
                        Evapotranspiration Rate
                      </Text>
                      <Text style={[styles.impactValue, { color: colors.warning }]}>
                        {stationData.environmental?.evapotranspiration || 'MODERATE'}
                      </Text>
                    </View>
                  </View>
                </View>

                {renderDataGrid([
                  { label: 'Soil Moisture Index', value: stationData.environmental?.soilMoisture || '68%', highlight: true },
                  { label: 'Vegetation Index', value: stationData.environmental?.vegetationIndex || '0.72' },
                  { label: 'Land Use Type', value: stationData.environmental?.landUse || 'Agricultural' },
                  { label: 'Runoff Coefficient', value: stationData.environmental?.runoffCoeff || '0.25' },
                  { label: 'Climate Zone', value: stationData.environmental?.climateZone || 'Semi-Arid' },
                  { label: 'Water Stress Level', value: stationData.environmental?.waterStress || 'Low', highlight: true },
                ])}
              </View>
            </View>
          </View>

          <View style={styles.monitoringSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#10b98115' }]}>
                <Activity size={18} color="#10b981" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recharge Monitoring</Text>
            </View>
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
                  {stationData?.recharge?.contributingSources?.map((source: string, index: number) => (
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
          </View>

          <View style={styles.monitoringSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#f59e0b15' }]}>
                <BarChart3 size={18} color="#f59e0b" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>System Monitoring</Text>
            </View>
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
                    {stationData.system.alerts.map((alert: string, index: number) => (
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
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  downloadButton: {
    padding: 10,
    borderRadius: 8,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  // Download Options Styles - Enhanced & Responsive
  downloadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  downloadOptions: {
    position: 'absolute',
    top: '100%',
    right: 20,
    width: 320,
    maxHeight: 400,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
  },
  downloadOptionsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  downloadOptionsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  downloadCloseButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  downloadOptionsScroll: {
    maxHeight: 280,
  },
  downloadOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  downloadOptionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  downloadOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadOptionInfo: {
    flex: 1,
  },
  downloadOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  downloadOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  downloadOptionMeta: {
    alignItems: 'flex-end',
  },
  downloadOptionFormat: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  downloadOptionSize: {
    fontSize: 10,
    fontWeight: '500',
  },
  downloadOptionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  downloadAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 12,
    padding: 14,
    borderRadius: 10,
  },
  downloadAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  // Overview Section Styles (Dashboard Style)
  overviewSection: {
    marginBottom: 24,
  },
  overviewCards: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewCardTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  overviewCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Monitoring Section Styles (Dashboard Style)
  monitoringSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  // Groundwater Level Metrics Styles
  levelMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  levelMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  levelMetricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  levelMetricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  levelMetricUnit: {
    fontSize: 10,
    textAlign: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Environmental Metrics Styles
  environmentalMetrics: {
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  environmentalMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  environmentalMetricLabel: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    marginLeft: 4,
  },
  environmentalMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Telemetry Metrics Styles
  telemetryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  telemetryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  telemetryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  // Enhanced Environmental Monitoring Styles
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  soilTypeSection: {
    marginBottom: 16,
  },
  soilTypeInfo: {
    backgroundColor: 'rgba(168, 85, 247, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#a855f7',
  },
  soilTypeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  soilDescription: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  weatherSection: {
    marginBottom: 16,
  },
  weatherMetrics: {
    gap: 12,
    marginBottom: 16,
  },
  weatherMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  weatherLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginLeft: 4,
  },
  weatherValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  impactSection: {
    gap: 12,
    marginBottom: 16,
  },
  impactItem: {
    marginBottom: 8,
  },
  impactIndicator: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  impactLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Dashboard Cards for Environmental Data
  dashboardCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  dashboardContent: {
    marginTop: 4,
  },
  // Existing Styles
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    flex: 1,
  },
  cardContent: {
    gap: 8,
    paddingBottom: 8,
  },
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
  gridLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    lineHeight: 16,
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
});

export default DWLRStationDetailsModal;