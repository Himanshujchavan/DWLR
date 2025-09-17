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

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, isDark && styles.chartTitleDark]}>Daily Groundwater Levels</Text>
        <View style={styles.headerStats}>
          <Text style={[styles.totalRainfall, isDark && styles.totalRainfallDark]}>
            Recent Rain: {mockData.reduce((sum, data) => sum + data.rainfall, 0)}mm
          </Text>
          <Text style={[styles.deviation, isDark && styles.deviationDark]}>
            Trend: {((mockData[mockData.length - 1].level - mockData[0].level)).toFixed(1)}m
          </Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={[styles.yLabel, isDark && styles.yLabelDark]}>{maxLevel.toFixed(1)}m</Text>
          <Text style={[styles.yLabel, isDark && styles.yLabelDark]}>{((maxLevel + minLevel) / 2).toFixed(1)}m</Text>
          <Text style={[styles.yLabel, isDark && styles.yLabelDark]}>{minLevel.toFixed(1)}m</Text>
        </View>
        
        <View style={styles.chart}>
          {mockData.map((data, index) => {
            const height = ((data.level - minLevel) / levelRange) * 100;
            // Determine if this day shows an improvement from the previous day
            const isImproving = index > 0 && data.level > mockData[index - 1].level;
            const gradientColors = isImproving 
              ? (isDark ? ['#64b5f6', '#1e88e5'] as const : ['#3498db', '#2980b9'] as const)
              : ['#f59e0b', '#d97706'] as const;
            
            return (
              <View key={index} style={styles.barGroup}>
                <View style={styles.bars}>
                  <LinearGradient
                    colors={gradientColors}
                    style={[styles.actualBar, { height: Math.max(height, 5) }]}
                  />
                </View>
                <Text style={[styles.monthLabel, isDark && styles.monthLabelDark]}>{data.date.split(' ')[1]}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={[styles.legend, isDark && styles.legendDark]}>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={isDark ? ['#64b5f6', '#1e88e5'] as const : ['#3498db', '#2980b9'] as const}
            style={styles.legendColor}
          />
          <Text style={[styles.legendText, isDark && styles.legendTextDark]}>Rising Level</Text>
        </View>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={['#f59e0b', '#d97706'] as const}
            style={styles.legendColor}
          />
          <Text style={[styles.legendText, isDark && styles.legendTextDark]}>Falling Level</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  containerDark: {
    backgroundColor: 'transparent',
    padding: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  chartTitleDark: {
    color: '#ffffff',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRainfall: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  totalRainfallDark: {
    color: '#64b5f6',
  },
  deviation: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '500',
  },
  deviationDark: {
    color: '#34d399',
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
    color: '#7f8c8d',
    textAlign: 'right',
  },
  yLabelDark: {
    color: 'rgba(255,255,255,0.8)',
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  barGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bars: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
  normalBarDark: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  monthLabel: {
    fontSize: 9,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  monthLabelDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  legendDark: {
    borderTopColor: 'rgba(255,255,255,0.2)',
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
    color: '#2c3e50',
  },
  legendTextDark: {
    color: '#ffffff',
  },
});
