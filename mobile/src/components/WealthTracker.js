import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

const WealthTracker = ({ dailyData = [] }) => {
  const defaultData = [
    { value: 120, label: 'Mon', netValue: 45 },
    { value: 150, label: 'Tue', netValue: 65 },
    { value: 180, label: 'Wed', netValue: 80 },
    { value: 140, label: 'Thu', netValue: 55 },
    { value: 200, label: 'Fri', netValue: 95 },
    { value: 170, label: 'Sat', netValue: 70 },
    { value: 190, label: 'Sun', netValue: 85 },
  ];

  const chartData = dailyData.length > 0 ? dailyData : defaultData;
  
  const barData = chartData.map(item => ({
    value: item.value,
    label: item.label,
    frontColor: '#004D40',
    topLabelComponent: () => (
      <Text style={styles.barLabel}>₵{item.value}</Text>
    ),
  }));

  const lineData = chartData.map(item => ({
    value: item.netValue,
    dataPointText: `₵${item.netValue}`,
  }));

  const totalGross = chartData.reduce((sum, item) => sum + item.value, 0);
  const totalNet = chartData.reduce((sum, item) => sum + item.netValue, 0);
  const profitMargin = totalGross > 0 ? ((totalNet / totalGross) * 100).toFixed(0) : 0;

  const isGoodMargin = profitMargin >= 40;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wealth Tracker</Text>
        <View style={[styles.badge, isGoodMargin ? styles.goodBadge : styles.warningBadge]}>
          {isGoodMargin ? (
            <TrendingUp size={12} color="#FFF" />
          ) : (
            <TrendingDown size={12} color="#FFF" />
          )}
          <Text style={styles.badgeText}>{profitMargin}% margin</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#004D40' }]} />
            <Text style={styles.legendText}>Gross Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#00E676' }]} />
            <Text style={styles.legendText}>Net Profit</Text>
          </View>
        </View>

        <BarChart
          data={barData}
          barWidth={24}
          spacing={20}
          roundedTop
          roundedBottom
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          noOfSections={4}
          maxValue={250}
          hideRules
          backgroundColor="transparent"
          isAnimated
          showGradient
          gradientColor="#006A60"
        />
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Gross Total</Text>
          <Text style={styles.summaryValue}>₵{totalGross}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net Total</Text>
          <Text style={[styles.summaryValue, { color: '#00E676' }]}>₵{totalNet}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goodBadge: {
    backgroundColor: '#10B981',
  },
  warningBadge: {
    backgroundColor: '#F59E0B',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  chartContainer: {
    marginBottom: 20,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#74777F',
  },
  barLabel: {
    fontSize: 9,
    color: '#74777F',
    marginBottom: 2,
  },
  axisText: {
    fontSize: 10,
    color: '#74777F',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#74777F',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
});

export default WealthTracker;