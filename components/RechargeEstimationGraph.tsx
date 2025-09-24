import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

// Define types
type DataPoint = {
  x: number;
  label: string;
  y: number;
  type: 'past' | 'current' | 'future';
};

type TimeRange = "1W" | "1M" | "3M" | "6M" | "1Y" | "3Y" | "5Y";

const { width: screenWidth } = Dimensions.get('window');
const containerPadding = 32; // 16px padding on each side
const yAxisWidth = 50;
const chartMargin = 20;
const chartWidth = screenWidth - containerPadding - yAxisWidth - chartMargin;
const chartHeight = 180;

const RechargeEstimationGraph = () => {
  const [range, setRange] = useState<TimeRange>("1W");
  const colorScheme = useColorScheme();
  
  // Theme-aware colors - memoized for performance
  const themeColors = useMemo(() => ({
    background: colorScheme === 'light' ? Colors.light.background : Colors.dark.background,
    text: colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
    textSecondary: colorScheme === 'light' ? Colors.light.textSecondary : Colors.dark.textSecondary,
    cardBackground: colorScheme === 'light' ? Colors.light.cardBackground : Colors.dark.cardBackground,
    cardBorder: colorScheme === 'light' ? Colors.light.cardBorder : Colors.dark.cardBorder,
    primary: colorScheme === 'light' ? Colors.light.primary : Colors.dark.primary,
    secondary: colorScheme === 'light' ? Colors.light.secondary : Colors.dark.secondary,
    statusHigh: colorScheme === 'light' ? Colors.light.statusHigh : Colors.dark.statusHigh,
    gridLine: colorScheme === 'light' ? '#F3F4F6' : '#374151',
    rangeSelector: colorScheme === 'light' ? Colors.light.backgroundSoft : Colors.dark.backgroundSoft,
    statsBackground: colorScheme === 'light' ? Colors.light.backgroundSoft : Colors.dark.backgroundSoft,
    statsBorder: colorScheme === 'light' ? Colors.light.cardBorder : Colors.dark.cardBorder,
  }), [colorScheme]);

  // Enhanced dataset with past, current, and future data
  const dataSets: Record<TimeRange, DataPoint[]> = {
    "1W": [
      { x: 1, label: "Mon", y: 2.1, type: "past" },
      { x: 2, label: "Tue", y: 2.4, type: "past" },
      { x: 3, label: "Wed", y: 2.3, type: "current" },
      { x: 4, label: "Thu", y: 2.8, type: "future" },
      { x: 5, label: "Fri", y: 3.0, type: "future" },
      { x: 6, label: "Sat", y: 3.1, type: "future" },
      { x: 7, label: "Sun", y: 3.4, type: "future" },
    ],
    "1M": [
      { x: 1, label: "W1", y: 2.2, type: "past" },
      { x: 2, label: "W2", y: 2.6, type: "current" },
      { x: 3, label: "W3", y: 3.0, type: "future" },
      { x: 4, label: "W4", y: 3.3, type: "future" },
    ],
    "3M": [
      { x: 1, label: "M1", y: 2.4, type: "current" },
      { x: 2, label: "M2", y: 2.9, type: "future" },
      { x: 3, label: "M3", y: 3.5, type: "future" },
    ],
    "6M": [
      { x: 1, label: "M1", y: 2.5, type: "past" },
      { x: 2, label: "M2", y: 3.0, type: "current" },
      { x: 3, label: "M3", y: 3.4, type: "future" },
      { x: 4, label: "M4", y: 3.8, type: "future" },
      { x: 5, label: "M5", y: 4.0, type: "future" },
      { x: 6, label: "M6", y: 4.2, type: "future" },
    ],
    "1Y": [
      { x: 1, label: "Q1", y: 3.0, type: "past" },
      { x: 2, label: "Q2", y: 3.5, type: "current" },
      { x: 3, label: "Q3", y: 4.1, type: "future" },
      { x: 4, label: "Q4", y: 4.7, type: "future" },
    ],
    "3Y": [
      { x: 1, label: "2024", y: 3.0, type: "past" },
      { x: 2, label: "2025", y: 4.2, type: "current" },
      { x: 3, label: "2026", y: 5.1, type: "future" },
    ],
    "5Y": [
      { x: 1, label: "2024", y: 2.5, type: "past" },
      { x: 2, label: "2025", y: 3.2, type: "current" },
      { x: 3, label: "2026", y: 4.0, type: "future" },
      { x: 4, label: "2027", y: 4.8, type: "future" },
      { x: 5, label: "2028", y: 6.0, type: "future" },
    ],
  };

  const currentData = dataSets[range];
  
  // Split data into past, current, and future
  const pastData = currentData.filter(d => d.type === "past");
  const currentPoint = currentData.find(d => d.type === "current");
  const futureData = currentData.filter(d => d.type === "future");

  // Calculate chart dimensions and scales
  const maxY = Math.max(...currentData.map(d => d.y));
  const minY = Math.min(...currentData.map(d => d.y));
  const yRange = maxY - minY;
  const yPadding = yRange * 0.2;

  const scaleY = (value: number) => {
    return chartHeight - ((value - minY + yPadding) / (yRange + 2 * yPadding)) * chartHeight;
  };

  const scaleX = (value: number) => {
    const padding = 20; // Increased padding for better data arrangement
    const availableWidth = chartWidth - (padding * 2);
    return padding + ((value - 1) / (currentData.length - 1)) * availableWidth;
  };

  // Create SVG path for past data line
  const createPath = (data: DataPoint[]) => {
    if (data.length < 2) return '';
    
    let path = `M ${scaleX(data[0].x)} ${scaleY(data[0].y)}`;
    for (let i = 1; i < data.length; i++) {
      const prevX = scaleX(data[i - 1].x);
      const prevY = scaleY(data[i - 1].y);
      const currX = scaleX(data[i].x);
      const currY = scaleY(data[i].y);
      
      // Smooth curves using bezier
      const cp1x = prevX + (currX - prevX) / 3;
      const cp2x = currX - (currX - prevX) / 3;
      path += ` C ${cp1x} ${prevY}, ${cp2x} ${currY}, ${currX} ${currY}`;
    }
    return path;
  };

  // Create dashed path for future data
  const createDashedPath = (data: DataPoint[]) => {
    if (data.length < 2) return '';
    return createPath(data);
  };

  const pastLine = pastData.length > 0 && currentPoint ? [...pastData, currentPoint] : pastData;
  const futureLine = currentPoint && futureData.length > 0 ? [currentPoint, ...futureData] : futureData;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.cardBorder }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons 
              name="chart-line" 
              size={24} 
              color={themeColors.secondary} 
              style={styles.titleIcon}
            />
            <Text style={[styles.title, { color: themeColors.text }]}>Recharge Estimation - {range}</Text>
          </View>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: themeColors.textSecondary }]} />
            <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Past</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: themeColors.secondary }]} />
            <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Current</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: themeColors.statusHigh }]} />
            <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Future</Text>
          </View>
        </View>
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.yAxisLabel, { color: themeColors.textSecondary }]}>{maxY.toFixed(1)}m</Text>
          <Text style={[styles.yAxisLabel, { color: themeColors.textSecondary }]}>{((maxY + minY) / 2).toFixed(1)}m</Text>
          <Text style={[styles.yAxisLabel, { color: themeColors.textSecondary }]}>{minY.toFixed(1)}m</Text>
        </View>

        {/* SVG Chart */}
        <View style={styles.svgContainer}>
          <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
            <Defs>
              <SvgLinearGradient id="futureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={themeColors.statusHigh} stopOpacity={0.3} />
                <Stop offset="100%" stopColor={themeColors.statusHigh} stopOpacity={0.1} />
              </SvgLinearGradient>
            </Defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <Path
                key={`grid-${i}`}
                d={`M 20 ${chartHeight * ratio} L ${chartWidth - 20} ${chartHeight * ratio}`}
                stroke={themeColors.gridLine}
                strokeWidth={1}
              />
            ))}

            {/* Future area fill */}
            {futureLine.length > 1 && (
              <Path
                d={`${createPath(futureLine)} L ${scaleX(futureLine[futureLine.length - 1].x)} ${chartHeight} L ${scaleX(futureLine[0].x)} ${chartHeight} Z`}
                fill="url(#futureGradient)"
              />
            )}

            {/* Past line */}
            {pastLine.length > 1 && (
              <Path
                d={createPath(pastLine)}
                stroke="#64748B"
                strokeWidth={3}
                fill="none"
              />
            )}

            {/* Future line (dashed) */}
            {futureLine.length > 1 && (
              <Path
                d={createDashedPath(futureLine)}
                stroke={themeColors.statusHigh}
                strokeWidth={3}
                strokeDasharray="10,5"
                fill="none"
              />
            )}

            {/* Data points */}
            {currentData.map((point, index) => {
              let fill: string;
              let stroke: string;
              let strokeWidth: number;
              let radius: number;

              switch (point.type) {
                case 'past':
                  fill = "#64748B";
                  stroke = colorScheme === 'light' ? "#374151" : "#9CA3AF";
                  strokeWidth = 2;
                  radius = 4;
                  break;
                case 'current':
                  fill = themeColors.primary;
                  stroke = colorScheme === 'light' ? "#fff" : themeColors.cardBackground;
                  strokeWidth = 3;
                  radius = 7;
                  break;
                case 'future':
                  fill = themeColors.statusHigh;
                  stroke = colorScheme === 'light' ? "#fff" : themeColors.cardBackground;
                  strokeWidth = 2;
                  radius = 4;
                  break;
              }

              return (
                <Circle
                  key={`point-${index}`}
                  cx={scaleX(point.x)}
                  cy={scaleY(point.y)}
                  r={radius}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
              );
            })}
          </Svg>

          {/* X-axis labels */}
          <View style={styles.xAxis}>
            {currentData.map((point, index) => {
              // Show every other label for longer ranges, all labels for shorter ranges
              const shouldShow = currentData.length <= 4 || index % 2 === 0 || index === currentData.length - 1;
              if (!shouldShow) return null;
              
              const xPosition = scaleX(point.x);
              const labelWidth = 30; // Reduced label width for better alignment
              const adjustedLeft = Math.max(5, Math.min(chartWidth - labelWidth - 5, xPosition - labelWidth / 2));
              
              return (
                <Text 
                  key={`label-${index}`} 
                  style={[styles.xAxisLabel, { 
                    left: adjustedLeft, 
                    width: labelWidth,
                    color: themeColors.textSecondary,
                    backgroundColor: colorScheme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(31,41,55,0.9)',
                    borderRadius: 3,
                    paddingVertical: 1,
                    paddingHorizontal: 2,
                  }]}
                >
                  {point.label}
                </Text>
              );
            })}
          </View>
        </View>
      </View>

      {/* Time Range Selector */}
      <View style={[styles.rangeSelector, { backgroundColor: themeColors.rangeSelector }]}>
        {(["1W", "1M", "3M", "6M", "1Y", "3Y", "5Y"] as TimeRange[]).map((r) => (
          <TouchableOpacity 
            key={r} 
            onPress={() => setRange(r)}
            style={[
              styles.rangeButton,
              range === r && styles.activeRangeButton
            ]}
            activeOpacity={0.8}
          >
            {range === r ? (
              <LinearGradient
                colors={[themeColors.statusHigh, themeColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activeButtonGradient}
              >
                <Text style={[styles.rangeText, styles.activeRangeText]}>
                  {r}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveButton}>
                <Text style={[styles.rangeText, { color: themeColors.textSecondary }]}>
                  {r}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Statistics */}
      <View style={[styles.statsContainer, { backgroundColor: themeColors.statsBackground, borderColor: themeColors.statsBorder }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Current</Text>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>
            {currentPoint ? `${currentPoint.y}m` : 'N/A'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Projected Peak</Text>
          <Text style={[styles.statValue, { color: themeColors.statusHigh }]}>
            {futureData.length > 0 ? `${Math.max(...futureData.map(d => d.y))}m` : 'N/A'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Growth Trend</Text>
          <Text style={[styles.statValue, { color: themeColors.secondary }]}>
            {futureData.length > 0 && currentPoint ? 
              `+${((Math.max(...futureData.map(d => d.y)) - currentPoint.y) / currentPoint.y * 100).toFixed(1)}%` : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 0, // Removed padding to start content from left margin
    paddingTop: 15, // Add top margin
    paddingBottom: 25, // Add more bottom padding for X-axis labels
    borderRadius: 12, // Match GroundwaterChart border radius
    marginBottom: 16, // Match GroundwaterChart margin
    borderWidth: 1,
  },
  header: {
    flexDirection: "column",
    marginBottom: 15, // Reduced margin for compact layout
    paddingHorizontal: 20 // Add horizontal padding for text content
  },
  titleContainer: {
    marginBottom: 12
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  titleIcon: {
    marginRight: 8
  },
  title: { 
    fontSize: 20, 
    fontWeight: "700", 
    letterSpacing: -0.5
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap"
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  legendText: {
    fontSize: 11,
  },
  chartContainer: {
    flexDirection: 'row',
    height: chartHeight + 40, // More space for X-axis labels
    marginBottom: 5, // Minimal margin
    // Removed overflow: 'hidden' to allow labels to be visible
  },
  yAxis: {
    width: yAxisWidth,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 10,
    height: chartHeight
  },
  yAxisLabel: {
    fontSize: 11,
    textAlign: 'right'
  },
  svgContainer: {
    flex: 1,
    position: 'relative',
    minWidth: 0 // Prevent flex overflow
  },
  svg: {
    backgroundColor: 'transparent'
  },
  xAxis: {
    position: 'absolute',
    bottom: -10, // Move closer to prevent overlap with range selector
    left: 0,
    right: 0,
    height: 20, // Reduced height for compact layout
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 11, // Slightly smaller font for compact layout
    textAlign: 'center',
    fontWeight: '600', // Made bolder for better visibility
  },
  rangeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    marginTop: 25, // Increase top margin to prevent overlap with X-axis
    marginBottom: 15, // Reduced margin for compact layout
    marginHorizontal: 20, // Add horizontal margin for button container
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  rangeButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 8,
    overflow: 'hidden'
  },
  activeButtonGradient: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3
  },
  inactiveButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  activeRangeButton: {
    // This style is no longer needed as we use gradient
  },
  rangeText: { 
    fontSize: 11, 
    fontWeight: "600",
    textAlign: "center"
  },
  activeRangeText: {
    color: "#fff",
    fontWeight: "700",
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
    flexWrap: "wrap",
    gap: 12,
    marginHorizontal: 0,
    marginBottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  statItem: {
    alignItems: "center",
    minWidth: 80,
    flex: 1,
    paddingVertical: 8
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "500"
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center"
  }
});

export default RechargeEstimationGraph;
