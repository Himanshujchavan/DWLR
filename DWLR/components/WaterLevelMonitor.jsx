import { Droplets, Minus, TrendingDown, TrendingUp } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

const stationData = [
  {
    id: 'DWLR001',
    name: 'Pune Central Station',
    currentLevel: 12.5,
    previousLevel: 12.8,
    trend: 'up',
    status: 'safe',
    lastReading: '10:30 AM'
  },
  {
    id: 'DWLR002',
    name: 'Mumbai Suburban',
    currentLevel: 8.9,
    previousLevel: 9.2,
    trend: 'down',
    status: 'critical',
    lastReading: '10:15 AM'
  },
  {
    id: 'DWLR003',
    name: 'Nashik Agricultural',
    currentLevel: 15.2,
    previousLevel: 15.2,
    trend: 'stable',
    status: 'safe',
    lastReading: '10:45 AM'
  },
  {
    id: 'DWLR004',
    name: 'Aurangabad Industrial',
    currentLevel: 18.7,
    previousLevel: 18.1,
    trend: 'down',
    status: 'semi-critical',
    lastReading: '10:20 AM'
  }
];

export default function WaterLevelMonitor({ variant = 'light' }) {
  const isDark = variant === 'dark';
  const colors = {
    title: isDark ? '#ffffff' : '#2c3e50',
    subtitle: isDark ? 'rgba(255,255,255,0.7)' : '#7f8c8d',
    muted: isDark ? 'rgba(255,255,255,0.6)' : '#95a5a6',
    primary: isDark ? '#64b5f6' : '#3498db',
    cardBg: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff',
    border: isDark ? 'rgba(255,255,255,0.2)' : '#ecf0f1',
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: '#2563eb15' }]}>
          <Droplets size={18} color={colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.title }]}>Water Level Monitoring</Text>
      </View>
      <View style={styles.stationList}>
        {stationData.map((station) => (
          <StationCard key={station.id} {...station} isDark={isDark} colors={colors} />
        ))}
      </View>
    </View>
  );
}

function StationCard({ id, name, currentLevel, previousLevel, trend, status, lastReading, isDark, colors }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#27ae60';
      case 'down': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'safe': return '#27ae60';
      case 'semi-critical': return '#f39c12';
      case 'critical': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const TrendIcon = getTrendIcon();
  const trendColor = getTrendColor();
  const statusColor = getStatusColor();
  const change = Math.abs(currentLevel - previousLevel).toFixed(1);

  return (
    <View style={[
      styles.stationCard,
      {
        backgroundColor: colors.cardBg,
        borderWidth: 1,
        borderColor: colors.border,
        shadowOpacity: isDark ? 0 : 0.1,
      },
    ]}>
      <View style={styles.stationHeader}>
        <View>
          <Text style={[styles.stationName, { color: colors.title }]}>{name}</Text>
          <Text style={[styles.stationId, { color: colors.muted }]}>{id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.levelContainer}>
        <Text style={[styles.currentLevel, { color: colors.primary }]}>{currentLevel}m</Text>
        <View style={[styles.trendContainer, { backgroundColor: trendColor + '20' }]}>
          <TrendIcon size={16} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {trend === 'stable' ? 'No change' : `${change}m`}
          </Text>
        </View>
      </View>
      
      <View style={styles.stationFooter}>
        <Text style={[styles.subtitle, { color: colors.subtitle }]}>Below ground level</Text>
        <Text style={[styles.lastReading, { color: colors.muted }]}>Updated: {lastReading}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 0,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stationList: {
    gap: 16,
  },
  stationCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  stationId: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  currentLevel: {
    fontSize: 32,
    fontWeight: '700',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  stationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
  },
  lastReading: {
    fontSize: 12,
  },
});