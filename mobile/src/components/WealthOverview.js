import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { TrendingUp, Minus, TrendingDown } from 'lucide-react-native';

const WealthOverview = ({ 
  totalSaved = 1240.50,
  netProfit = 300,
  fuelCost = 180,
  leaks = 120,
  highProfitDays = 4,
  breakEvenDays = 2,
  lossDays = 1
}) => {
  const total = netProfit + fuelCost + leaks;
  const netPercent = (netProfit / total) * 100;
  const fuelPercent = (fuelCost / total) * 100;
  const leakPercent = (leaks / total) * 100;

  const radius = 60;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  
  const netStroke = (netPercent / 100) * circumference;
  const fuelStroke = (fuelPercent / 100) * circumference;
  const leakStroke = (leakPercent / 100) * circumference;

  const formatCurrency = (value) => `₵${value.toFixed(2)}`;

  return (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Wealth Overview</Text>

      <View style={styles.contentRow}>
        <View style={styles.leftSection}>
          <View style={styles.mainStat}>
            <Text style={styles.mainLabel}>Total Saved This Month</Text>
            <Text style={styles.mainValue}>{formatCurrency(totalSaved)}</Text>
          </View>

          <View style={styles.gaugeContainer}>
            <Svg width={140} height={140}>
              <G rotation="-90" origin="70, 70">
                <Circle
                  cx={70}
                  cy={70}
                  r={radius}
                  stroke="#FEE2E2"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <Circle
                  cx={70}
                  cy={70}
                  r={radius}
                  stroke="#EF4444"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${leakStroke} ${circumference}`}
                  strokeLinecap="round"
                />
                <Circle
                  cx={70}
                  cy={70}
                  r={radius}
                  stroke="#FBBF24"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${fuelStroke} ${circumference}`}
                  strokeDashoffset={-leakStroke}
                  strokeLinecap="round"
                />
                <Circle
                  cx={70}
                  cy={70}
                  r={radius}
                  stroke="#10B981"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${netStroke} ${circumference}`}
                  strokeDashoffset={-(leakStroke + fuelStroke)}
                  strokeLinecap="round"
                />
              </G>
            </Svg>
            <View style={styles.gaugeCenter}>
              <Text style={styles.gaugeLabel}>Today</Text>
              <Text style={styles.gaugeValue}>{formatCurrency(netProfit)}</Text>
              <Text style={styles.gaugeSub}>Net</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>Net Profit</Text>
                <Text style={styles.legendValue}>{formatCurrency(netProfit)}</Text>
              </View>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>Fuel & Maint.</Text>
                <Text style={styles.legendValue}>{formatCurrency(fuelCost)}</Text>
              </View>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>Leaks</Text>
                <Text style={styles.legendValue}>{formatCurrency(leaks)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.daysRow}>
        <View style={styles.dayStat}>
          <TrendingUp size={14} color="#10B981" />
          <Text style={styles.dayCount}>{highProfitDays}</Text>
          <Text style={styles.dayLabel}>Profit Days</Text>
        </View>
        <View style={styles.dayStat}>
          <Minus size={14} color="#FBBF24" />
          <Text style={styles.dayCount}>{breakEvenDays}</Text>
          <Text style={styles.dayLabel}>Break-even</Text>
        </View>
        <View style={styles.dayStat}>
          <TrendingDown size={14} color="#EF4444" />
          <Text style={styles.dayCount}>{lossDays}</Text>
          <Text style={styles.dayLabel}>Loss Days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 100,
    paddingLeft: 8,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 4,
  },
  mainLabel: {
    fontSize: 11,
    color: '#74777F',
  },
  mainValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#004D40',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  gaugeLabel: {
    fontSize: 9,
    color: '#74777F',
  },
  gaugeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  gaugeSub: {
    fontSize: 9,
    color: '#74777F',
  },
  legendContainer: {
    gap: 10,
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
    alignItems: 'flex-start',
  },
  legendLabel: {
    fontSize: 10,
    color: '#74777F',
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
  },
  dayStat: {
    alignItems: 'center',
    gap: 2,
  },
  dayCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  dayLabel: {
    fontSize: 10,
    color: '#74777F',
  },
});

export default WealthOverview;