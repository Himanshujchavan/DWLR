import { Colors } from '@/constants/Colors';
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
  const isDark = variant === 'dark';
  const maxRainfall = Math.max(...rainfallData.map(d => Math.max(d.rainfall, d.normal)));

  const colors = {
    background: isDark ? 'transparent' : Colors.light.cardBackground,
    text: isDark ? '#ffffff' : Colors.light.text,
    textSecondary: isDark ? 'rgba(255,255,255,0.8)' : Colors.light.textSecondary,
    textMuted: isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textSecondary,
    primary: isDark ? '#64b5f6' : Colors.light.primary,
    success: isDark ? '#34d399' : Colors.light.statusHigh,
    successDark: isDark ? '#10b981' : '#229954',
    normalBar: isDark ? 'rgba(255,255,255,0.4)' : '#bdc3c7',
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
        <Text style={[styles.chartTitle, { color: colors.text }]}>Rainfall vs Normal (mm)</Text>
        <View style={styles.headerStats}>
          <Text style={[styles.totalRainfall, { color: colors.primary }]}>Total: 1,043mm</Text>
          <Text style={[styles.deviation, { color: colors.success }]}>+8.2% above normal</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>{maxRainfall}</Text>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>{Math.round(maxRainfall * 0.5)}</Text>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>0</Text>
        </View>
        
        <View style={styles.chart}>
          {rainfallData.map((data, index) => {
            const actualHeight = (data.rainfall / maxRainfall) * 100;
            const normalHeight = (data.normal / maxRainfall) * 100;
            
            return (
              <View key={index} style={styles.barGroup}>
                <View style={styles.bars}>
                  <LinearGradient
                    colors={[colors.success, colors.successDark]}
                    style={[styles.actualBar, { height: Math.max(actualHeight, 2) }]}
                  />
                  <View
                    style={[styles.normalBar, { 
                      backgroundColor: colors.normalBar,
                      height: Math.max(normalHeight, 2) 
                    }]}
                  />
                </View>
                <Text style={[styles.monthLabel, { color: colors.textMuted }]}>{data.month}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={[styles.legend, { borderTopColor: colors.border }]}>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={[colors.success, colors.successDark]}
            style={styles.legendColor}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>Actual Rainfall</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.normalBar }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Normal Rainfall</Text>
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
    height: 120,
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
    minWidth: 20,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 8,
    width: 18,
  },
  actualBar: {
    width: 7,
    borderRadius: 2,
    marginRight: 1,
  },
  normalBar: {
    width: 7,
    borderRadius: 2,
    marginLeft: 1,
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
