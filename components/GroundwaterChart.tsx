import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

const mockData = [
  { date: 'Sep 05', level: 5.8, rainfall: 12 },
  { date: 'Sep 06', level: 5.7, rainfall: 8 },
  { date: 'Sep 07', level: 5.6, rainfall: 20 },
  { date: 'Sep 08', level: 5.5, rainfall: 15 },
  { date: 'Sep 09', level: 5.4, rainfall: 18 },
  { date: 'Sep 10', level: 5.3, rainfall: 25 },
  { date: 'Sep 11', level: 5.2, rainfall: 40 },
  { date: 'Sep 12', level: 5.1, rainfall: 35 },
  { date: 'Sep 13', level: 5.0, rainfall: 22 },
  { date: 'Sep 14', level: 5.2, rainfall: 10 },
  { date: 'Sep 15', level: 5.3, rainfall: 5 },
  { date: 'Sep 16', level: 5.4, rainfall: 0 },
  { date: 'Sep 17', level: 5.5, rainfall: 7 },
];



type Variant = 'light' | 'dark';

export default function GroundwaterChart({ variant = 'light' }: { variant?: Variant }) {
  const maxLevel = Math.max(...mockData.map(d => d.level));
  const minLevel = Math.min(...mockData.map(d => d.level));
  const levelRange = maxLevel - minLevel;

  const isDark = variant === 'dark';

  const colors = {
    background: isDark ? 'transparent' : Colors.light.cardBackground,
    text: isDark ? '#ffffff' : Colors.light.text,
    textSecondary: isDark ? 'rgba(255,255,255,0.8)' : Colors.light.textSecondary,
    textMuted: isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textSecondary,
    primary: isDark ? '#64b5f6' : Colors.light.primary,
    primaryDark: isDark ? '#1e88e5' : '#2980b9',
    success: isDark ? '#34d399' : Colors.light.statusHigh,
    border: isDark ? 'rgba(255,255,255,0.2)' : Colors.light.cardBorder,
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        ...(isDark ? {
          padding: 0,
          shadowOpacity: 0,
          elevation: 0,
        } : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        })
      }
    ]}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Daily Groundwater Levels</Text>
        <View style={styles.headerStats}>
          <Text style={[styles.deviation, { color: colors.success }]}>
            Trend: {((mockData[mockData.length - 1].level - mockData[0].level)).toFixed(1)}m
          </Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>{maxLevel.toFixed(1)}m</Text>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>{((maxLevel + minLevel) / 2).toFixed(1)}m</Text>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>{minLevel.toFixed(1)}m</Text>
        </View>
        
        <View style={styles.chart}>
          {mockData.map((data, index) => {
            const height = ((data.level - minLevel) / levelRange) * 100;
            // Determine if this day shows an improvement from the previous day
            const isImproving = index > 0 && data.level > mockData[index - 1].level;
            const gradientColors = isImproving 
              ? [colors.primary, colors.primaryDark] as const
              : ['#f59e0b', '#d97706'] as const;
            
            return (
              <View key={index} style={styles.barGroup}>
                <View style={styles.bars}>
                  <LinearGradient
                    colors={gradientColors}
                    style={[styles.actualBar, { height: Math.max(height, 5) }]}
                  />
                </View>
                <Text style={[styles.monthLabel, { color: colors.textMuted }]}>{data.date.split(' ')[1]}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={[styles.legend, { borderTopColor: colors.border }]}>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark] as const}
            style={styles.legendColor}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>Rising Level</Text>
        </View>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={['#f59e0b', '#d97706'] as const}
            style={styles.legendColor}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>Falling Level</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRainfall: {
    fontSize: 14,
    fontWeight: '600',
  },
  deviation: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yLabel: {
    fontSize: 12,
    textAlign: 'right',
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  barGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
  },
  bars: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    width: 12,
  },
  actualBar: {
    width: 10,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  normalBar: {
    width: 8,
    borderRadius: 2,
    backgroundColor: '#bdc3c7',
  },
  monthLabel: {
    fontSize: 9,
    textAlign: 'center',
    width: 18,
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});
