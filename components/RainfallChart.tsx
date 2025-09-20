import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';


const rainfallData = [
  { month: 'Jan', rainfall: 15, normal: 12 },
  { month: 'Feb', rainfall: 8, normal: 15 },
  { month: 'Mar', rainfall: 12, normal: 18 },
  { month: 'Apr', rainfall: 25, normal: 22 },
  { month: 'May', rainfall: 45, normal: 35 },
  { month: 'Jun', rainfall: 180, normal: 165 },
  { month: 'Jul', rainfall: 245, normal: 220 },
  { month: 'Aug', rainfall: 220, normal: 210 },
  { month: 'Sep', rainfall: 165, normal: 145 },
  { month: 'Oct', rainfall: 85, normal: 75 },
  { month: 'Nov', rainfall: 25, normal: 20 },
  { month: 'Dec', rainfall: 18, normal: 15 }
];

type Variant = 'light' | 'dark';

export default function RainfallChart({ variant = 'light' }: { variant?: Variant }) {
  const maxRainfall = Math.max(...rainfallData.map(d => Math.max(d.rainfall, d.normal)));

  return (
    <View style={[styles.container, variant === 'dark' && styles.containerDark]}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, variant === 'dark' && styles.chartTitleDark]}>Rainfall vs Normal (mm)</Text>
        <View style={styles.headerStats}>
          <Text style={[styles.totalRainfall, variant === 'dark' && styles.totalRainfallDark]}>Total: 1,043mm</Text>
          <Text style={[styles.deviation, variant === 'dark' && styles.deviationDark]}>+8.2% above normal</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={[styles.yLabel, variant === 'dark' && styles.yLabelDark]}>{maxRainfall}</Text>
          <Text style={[styles.yLabel, variant === 'dark' && styles.yLabelDark]}>{Math.round(maxRainfall * 0.5)}</Text>
          <Text style={[styles.yLabel, variant === 'dark' && styles.yLabelDark]}>0</Text>
        </View>
        
        <View style={styles.chart}>
          {rainfallData.map((data, index) => {
            const actualHeight = (data.rainfall / maxRainfall) * 100;
            const normalHeight = (data.normal / maxRainfall) * 100;
            
            return (
              <View key={index} style={styles.barGroup}>
                <View style={styles.bars}>
                  <LinearGradient
                    colors={variant === 'dark' ? ['#34d399', '#10b981'] : ['#27ae60', '#229954']}
                    style={[styles.actualBar, { height: Math.max(actualHeight, 2) }]}
                  />
                  <View
                    style={[styles.normalBar, variant === 'dark' && styles.normalBarDark, { height: Math.max(normalHeight, 2) }]}
                  />
                </View>
                <Text style={[styles.monthLabel, variant === 'dark' && styles.monthLabelDark]}>{data.month}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={[styles.legend, variant === 'dark' && styles.legendDark]}>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={variant === 'dark' ? ['#34d399', '#10b981'] : ['#27ae60', '#229954']}
            style={styles.legendColor}
          />
          <Text style={[styles.legendText, variant === 'dark' && styles.legendTextDark]}>Actual Rainfall</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: variant === 'dark' ? 'rgba(255,255,255,0.4)' : '#bdc3c7' }]} />
          <Text style={[styles.legendText, variant === 'dark' && styles.legendTextDark]}>Normal Rainfall</Text>
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
    height: 120,
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
    flex: 1,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  actualBar: {
    width: 8,
    borderRadius: 2,
    marginRight: 2,
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
    fontSize: 10,
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
