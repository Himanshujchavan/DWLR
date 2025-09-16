import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, FlaskConical, Circle as XCircle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

const qualityData = [
  {
    parameter: 'pH Level',
    value: 7.2,
    unit: '',
    status: 'good',
    range: '6.5-8.5',
    icon: CheckCircle
  },
  {
    parameter: 'TDS',
    value: 450,
    unit: 'ppm',
    status: 'moderate',
    range: '<500',
    icon: AlertTriangle
  },
  {
    parameter: 'Fluoride',
    value: 0.8,
    unit: 'mg/L',
    status: 'good',
    range: '<1.5',
    icon: CheckCircle
  },
  {
    parameter: 'Nitrate',
    value: 52,
    unit: 'mg/L',
    status: 'high',
    range: '<45',
    icon: XCircle
  }
];

export default function QualityMonitor({ variant = 'light' }) {
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
        <View style={[styles.iconContainer, { backgroundColor: '#10b98115' }]}>
          <FlaskConical size={18} color={colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.title }]}>Water Quality Parameters</Text>
      </View>
      <View style={styles.qualityGrid}>
        {qualityData.map((item, index) => (
          <QualityCard key={index} {...item} isDark={isDark} colors={colors} />
        ))}
      </View>
    </View>
  );
}

function QualityCard({ parameter, value, unit, status, range, icon: Icon, isDark, colors }) {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return '#27ae60';
      case 'moderate': return '#f39c12';
      case 'high': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const statusColor = getStatusColor();

  return (
    <View style={[
      styles.qualityCard,
      {
        backgroundColor: colors.cardBg,
        borderWidth: 1,
        borderColor: colors.border,
        shadowOpacity: isDark ? 0 : 0.1,
      },
    ]}>
      <View style={styles.cardHeader}>
        <Icon size={20} color={statusColor} />
        <Text style={[styles.parameter, { color: colors.title }]}>{parameter}</Text>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: colors.primary }]}>{value}</Text>
        <Text style={[styles.unit, { color: colors.muted }]}>{unit}</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={[styles.range, { color: colors.muted }]}>Range: {range}</Text>
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status.toUpperCase()}</Text>
        </View>
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
  qualityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  qualityCard: {
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  parameter: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  unit: {
    fontSize: 14,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  range: {
    fontSize: 12,
  },
  statusIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '600',
  },
});