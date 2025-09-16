import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';


const mockData = [
  { month: 'Jan', level: 6.5, rainfall: 20 },
  { month: 'Feb', level: 6.2, rainfall: 15 },
  { month: 'Mar', level: 6.0, rainfall: 25 },
  { month: 'Apr', level: 5.8, rainfall: 40 },
  { month: 'May', level: 5.5, rainfall: 65 },
  { month: 'Jun', level: 5.0, rainfall: 150 },
  { month: 'Jul', level: 4.2, rainfall: 300 },
  { month: 'Aug', level: 4.5, rainfall: 280 },
  { month: 'Sep', level: 5.0, rainfall: 200 },
  { month: 'Oct', level: 5.8, rainfall: 100 },
  { month: 'Nov', level: 6.2, rainfall: 30 },
  { month: 'Dec', level: 6.4, rainfall: 25 }
];

type Variant = 'light' | 'dark';

export default function GroundwaterChart({ variant = 'light' }: { variant?: Variant }) {
  const maxLevel = Math.max(...mockData.map(d => d.level));
  const minLevel = Math.min(...mockData.map(d => d.level));
  const levelRange = maxLevel - minLevel;

  const isDark = variant === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={[styles.yLabel, isDark && styles.yLabelDark]}>{maxLevel.toFixed(1)}m</Text>
          <Text style={[styles.yLabel, isDark && styles.yLabelDark]}>{((maxLevel + minLevel) / 2).toFixed(1)}m</Text>
          <Text style={[styles.yLabel, isDark && styles.yLabelDark]}>{minLevel.toFixed(1)}m</Text>
        </View>
        
        <View style={styles.chart}>
          {mockData.map((data, index) => {
            const height = ((data.level - minLevel) / levelRange) * 120;
            return (
              <View key={index} style={styles.bar}>
                <LinearGradient
                  colors={isDark ? ['#64b5f6', '#42a5f5'] : ['#3498db', '#2980b9']}
                  style={[styles.barFill, { height: Math.max(height, 5) }]}
                />
                <Text style={[styles.monthLabel, isDark && styles.monthLabelDark]}>{data.month}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={[styles.legend, isDark && styles.legendDark]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: isDark ? '#64b5f6' : '#3498db' }]} />
          <Text style={[styles.legendText, isDark && styles.legendTextDark]}>Water Level (meters below ground)</Text>
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
  chartContainer: {
    flexDirection: 'row',
    height: 160,
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
    paddingHorizontal: 4,
  },
  bar: {
    alignItems: 'center',
    flex: 1,
  },
  barFill: {
    width: 18,
    borderRadius: 2,
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 10,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  monthLabelDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  legend: {
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
    fontSize: 14,
    color: '#2c3e50',
  },
  legendTextDark: {
    color: '#ffffff',
  },
});
