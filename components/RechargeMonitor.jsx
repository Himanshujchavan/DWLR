import { ArrowDown, ArrowUp, CloudRain, Droplets } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

const rechargeData = {
  currentMonth: {
    recharge: 85.2,
    extraction: 92.7,
    balance: -7.5,
    efficiency: 92
  },
  lastMonth: {
    recharge: 124.5,
    extraction: 89.1,
    balance: 35.4,
    efficiency: 140
  }
};

export default function RechargeMonitor({ variant = 'light' }) {
  const { currentMonth, lastMonth } = rechargeData;
  const rechargeChange = currentMonth.recharge - lastMonth.recharge;
  const extractionChange = currentMonth.extraction - lastMonth.extraction;
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
        <View style={[styles.iconContainer, { backgroundColor: '#22d3ee15' }]}>
          <Droplets size={18} color={colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.title }]}>Recharge vs Extraction</Text>
      </View>
      
      <View style={[
        styles.summaryCard,
        {
          backgroundColor: colors.cardBg,
          borderWidth: 1,
          borderColor: colors.border,
          shadowOpacity: isDark ? 0 : 0.1,
        },
      ]}>
        <View style={styles.summaryHeader}>
          <Text style={[styles.summaryTitle, { color: colors.title }]}>October 2024</Text>
          <View style={[
            styles.balanceBadge, 
            { backgroundColor: currentMonth.balance > 0 ? '#27ae60' : '#e74c3c' }
          ]}>
            <Text style={styles.balanceText}>
              {currentMonth.balance > 0 ? '+' : ''}{currentMonth.balance.toFixed(1)} MCM
            </Text>
          </View>
        </View>
        
        <View style={styles.metricsRow}>
          <MetricItem
            title="Recharge"
            value={currentMonth.recharge}
            unit="MCM"
            change={rechargeChange}
            icon={CloudRain}
            color="#3498db"
          />
          <MetricItem
            title="Extraction"
            value={currentMonth.extraction}
            unit="MCM"
            change={extractionChange}
            icon={ArrowUp}
            color="#e67e22"
          />
        </View>
        
        <View style={styles.efficiencyContainer}>
          <Text style={[styles.efficiencyLabel, { color: colors.title }]}>Recharge Efficiency</Text>
          <View style={[styles.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#ecf0f1' }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(currentMonth.efficiency, 100)}%`,
                  backgroundColor: currentMonth.efficiency >= 100 ? '#27ae60' : '#f39c12'
                }
              ]} 
            />
          </View>
          <Text style={[styles.efficiencyValue, { color: colors.title }]}>{currentMonth.efficiency}%</Text>
        </View>
      </View>
    </View>
  );
}

function MetricItem({ title, value, unit, change, icon: Icon, color }) {
  const isPositive = change > 0;
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown;
  const changeColor = isPositive ? '#27ae60' : '#e74c3c';

  return (
    <View style={styles.metricItem}>
      <View style={styles.metricHeader}>
        <Icon size={18} color={color} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      
      <View style={styles.metricValue}>
        <Text style={[styles.valueText, { color }]}>{value}</Text>
        <Text style={styles.unitText}>{unit}</Text>
      </View>
      
      <View style={styles.changeContainer}>
        <ChangeIcon size={12} color={changeColor} />
        <Text style={[styles.changeText, { color: changeColor }]}>
          {Math.abs(change).toFixed(1)} from last month
        </Text>
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
  summaryCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  balanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  balanceText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  metricItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
    fontWeight: '600',
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  unitText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 11,
    marginLeft: 4,
  },
  efficiencyContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  efficiencyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  efficiencyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#ffffff',
  },
});