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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#ffffff',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#f59e42',
  },
  qualityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  qualityCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  parameter: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#ffffff',
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  unit: {
    fontSize: 14,
    marginLeft: 4,
    color: 'rgba(255,255,255,0.8)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  range: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700',
  },
});