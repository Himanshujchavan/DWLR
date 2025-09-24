import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const containerPadding = 32; // 16px padding on each side of the card
const yAxisWidth = 40; // Reduced Y-axis width
const chartMargin = 0; // No additional margin
const chartWidth = screenWidth - containerPadding - yAxisWidth - chartMargin;
const chartHeight = 160; // Slightly increased height

const mockData = [
  { date: 'Sep 08', level: 5.5, rainfall: 15, trend: 'falling' },
  { date: 'Sep 09', level: 5.4, rainfall: 18, trend: 'falling' },
  { date: 'Sep 10', level: 5.3, rainfall: 25, trend: 'falling' },
  { date: 'Sep 11', level: 5.2, rainfall: 40, trend: 'falling' },
  { date: 'Sep 12', level: 5.1, rainfall: 35, trend: 'falling' },
  { date: 'Sep 13', level: 5.0, rainfall: 22, trend: 'falling' },
  { date: 'Sep 14', level: 5.2, rainfall: 10, trend: 'rising' },
  { date: 'Sep 15', level: 5.3, rainfall: 5, trend: 'rising' },
  { date: 'Sep 16', level: 5.4, rainfall: 0, trend: 'rising' },
  { date: 'Sep 17', level: 5.5, rainfall: 7, trend: 'rising' },
];



type Variant = 'light' | 'dark';

export default function GroundwaterChart({ variant = 'light' }: { variant?: Variant }) {
  const maxLevel = Math.max(...mockData.map(d => d.level));
  const minLevel = Math.min(...mockData.map(d => d.level));
  const levelRange = maxLevel - minLevel;
  const yPadding = levelRange * 0.2;

  const isDark = variant === 'dark';

  const colors = {
    background: isDark ? 'transparent' : Colors.light.cardBackground,
    text: isDark ? '#ffffff' : Colors.light.text,
    textSecondary: isDark ? 'rgba(255,255,255,0.8)' : Colors.light.textSecondary,
    textMuted: isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textSecondary,
    // Blue and red color theme
    primary: '#2563eb', // Blue-600
    primaryLight: '#60a5fa', // Blue-400
    primaryDark: '#1d4ed8', // Blue-700
    danger: '#dc2626', // Red-600 for falling points
    dangerLight: '#f87171', // Red-400
    success: '#10b981', // Green-500 for rising points
    border: isDark ? 'rgba(255,255,255,0.2)' : Colors.light.cardBorder,
    grid: '#f3f4f6',
  };

  // Chart scaling functions
  const scaleY = (value: number) => {
    return chartHeight - ((value - minLevel + yPadding) / (levelRange + 2 * yPadding)) * chartHeight;
  };

  const scaleX = (index: number) => {
    const padding = 5; // Minimal padding for edge points
    const availableWidth = chartWidth - (padding * 2);
    return padding + (index / (mockData.length - 1)) * availableWidth;
  };

  // Create smooth SVG path
  const createPath = () => {
    if (mockData.length < 2) return '';
    
    let path = `M ${scaleX(0)} ${scaleY(mockData[0].level)}`;
    for (let i = 1; i < mockData.length; i++) {
      const prevX = scaleX(i - 1);
      const prevY = scaleY(mockData[i - 1].level);
      const currX = scaleX(i);
      const currY = scaleY(mockData[i].level);
      
      // Smooth curves using bezier
      const cp1x = prevX + (currX - prevX) / 3;
      const cp2x = currX - (currX - prevX) / 3;
      path += ` C ${cp1x} ${prevY}, ${cp2x} ${currY}, ${currX} ${currY}`;
    }
    return path;
  };

  // Create area fill path
  const createAreaPath = () => {
    const linePath = createPath();
    if (!linePath) return '';
    
    return `${linePath} L ${scaleX(mockData.length - 1)} ${chartHeight} L ${scaleX(0)} ${chartHeight} Z`;
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
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>{maxLevel.toFixed(1)}m</Text>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>{((maxLevel + minLevel) / 2).toFixed(1)}m</Text>
          <Text style={[styles.yLabel, { color: colors.textSecondary }]}>{minLevel.toFixed(1)}m</Text>
        </View>
        
        {/* SVG Chart */}
        <View style={styles.svgContainer}>
          <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
            <Defs>
              <SvgLinearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={colors.primaryLight} stopOpacity={0.4} />
                <Stop offset="50%" stopColor={colors.primary} stopOpacity={0.2} />
                <Stop offset="100%" stopColor={colors.primaryDark} stopOpacity={0.05} />
              </SvgLinearGradient>
            </Defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <Path
                key={`grid-${i}`}
                d={`M 5 ${chartHeight * ratio} L ${chartWidth - 5} ${chartHeight * ratio}`}
                stroke={colors.grid}
                strokeWidth={1}
                strokeOpacity={0.5}
              />
            ))}

            {/* Area fill */}
            <Path
              d={createAreaPath()}
              fill="url(#blueGradient)"
            />

            {/* Main line */}
            <Path
              d={createPath()}
              stroke={colors.primary}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {mockData.map((data, index) => {
              const isRising = data.trend === 'rising';
              const isFalling = data.trend === 'falling';
              
              let pointColor = colors.primary;
              let strokeColor = '#fff';
              let radius = 4;
              
              if (isRising) {
                pointColor = colors.success;
                radius = 5;
              } else if (isFalling) {
                pointColor = colors.danger;
                radius = 5;
              }
              
              return (
                <Circle
                  key={`point-${index}`}
                  cx={scaleX(index)}
                  cy={scaleY(data.level)}
                  r={radius}
                  fill={pointColor}
                  stroke={strokeColor}
                  strokeWidth={2}
                />
              );
            })}
          </Svg>

          {/* X-axis labels */}
          <View style={styles.xAxis}>
            {mockData.map((data, index) => {
              if (index % 2 !== 0) return null; // Show every other label to prevent crowding
              
              const xPosition = scaleX(index);
              const labelWidth = 30; // Reduced label width for better alignment
              const adjustedLeft = Math.max(5, Math.min(chartWidth - labelWidth - 5, xPosition - labelWidth / 2));
              
              return (
                <Text 
                  key={`label-${index}`} 
                  style={[styles.xAxisLabel, { 
                    left: adjustedLeft, 
                    width: labelWidth, 
                    color: '#666666', // Explicit dark color
                    backgroundColor: 'rgba(255,255,255,0.9)', // More opaque background
                    borderRadius: 3, // Smaller border radius
                    paddingVertical: 1, // Reduced padding
                    paddingHorizontal: 2,
                  }]}
                >
                  {data.date.split(' ')[1]}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
      
      <View style={[styles.legend, { borderTopColor: colors.border }]}>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={[colors.success, colors.success]}
            style={styles.legendColor}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>Rising Level</Text>
        </View>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={[colors.danger, colors.danger]}
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
    padding: 0, // Removed padding to start content from left margin
    paddingBottom: 10, // Reduced bottom padding for compact layout
  },
  chartHeader: {
    marginBottom: 16,
    paddingHorizontal: 16, // Add horizontal padding only for text content
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
    height: chartHeight + 25, // Reduced gap between chart and labels
    marginBottom: 5, // Minimal margin
    // Removed overflow: 'hidden' to allow labels to be visible
  },
  yAxis: {
    width: yAxisWidth,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8, // Reduced padding
    height: chartHeight
  },
  yLabel: {
    fontSize: 11, // Reduced font size
    textAlign: 'right',
  },
  svgContainer: {
    flex: 1,
    position: 'relative',
    minWidth: 0,
  },
  svg: {
    backgroundColor: 'transparent'
  },
  xAxis: {
    position: 'absolute',
    bottom: -20, // Reduced gap from chart to labels
    left: 0,
    right: 0,
    height: 20, // Reduced height for compact layout
    zIndex: 10, // Ensure labels appear above other elements
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 11, // Slightly smaller font for compact layout
    textAlign: 'center',
    fontWeight: '600', // Made bolder for better visibility
    color: '#666', // Explicit color to ensure visibility
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
    marginTop: 10, // Reduced margin for compact layout
    paddingTop: 12, // Reduced padding
    paddingHorizontal: 16, // Add horizontal padding for legend content
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
