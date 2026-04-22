import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ArrowLeft, TrendingUp, TrendingDown, Target, DollarSign, BarChart3, PiggyBank } from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnnualVisionScreen = ({ navigation }) => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);

  const data = {
    monthly_data: [
      { month: 'Jan', income: 3200, expense: 1800, net: 1400, running_total: 1400 },
      { month: 'Feb', income: 2800, expense: 2100, net: 700, running_total: 2100 },
      { month: 'Mar', income: 3500, expense: 1900, net: 1600, running_total: 3700 },
      { month: 'Apr', income: 3100, expense: 2000, net: 1100, running_total: 4800 },
    ],
    total_income: 12600,
    total_expense: 7800,
    net_profit: 4800,
    avg_monthly_income: 3150,
    projected_annual_savings: 37800,
    current_year: 2026,
  };

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  const chartData = data.monthly_data.map((item, index) => ({
    value: item.running_total,
    dataPointText: `₵${item.running_total}`,
  }));

  const lineData = data.monthly_data.map(item => ({
    value: item.net,
    dataPointText: `₵${item.net}`,
  }));

  const isPositiveTrend = data.net_profit > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Annual Vision</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.projectionCard}>
          <View style={styles.projectionHeader}>
            <Target size={24} color="#FFFFFF" />
            <Text style={styles.projectionLabel}>PROJECTED SAVINGS</Text>
          </View>
          <Text style={styles.projectionAmount}>₵{data.projected_annual_savings.toLocaleString()}</Text>
          <Text style={styles.projectionYear}>by December {data.current_year}</Text>
          <View style={styles.projectionBadge}>
            <TrendingUp size={14} color="#10B981" />
            <Text style={styles.projectionBadgeText}>
              {data.avg_monthly_income}/month avg
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <BarChart3 size={20} color="#004D40" />
            <Text style={styles.chartTitle}>Wealth Growth Trend</Text>
          </View>
          
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#004D40' }]} />
              <Text style={styles.legendText}>Cumulative Savings</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#00E676' }]} />
              <Text style={styles.legendText}>Monthly Net</Text>
            </View>
          </View>

          <LineChart
            data={chartData}
            data2={lineData}
            width={SCREEN_WIDTH - 80}
            height={200}
            spacing={50}
            initialSpacing={30}
            color1="#004D40"
            color2="#00E676"
            thickness1={3}
            thickness2={2}
            hideDataPoints={false}
            dataPointsColor1="#004D40"
            dataPointsColor2="#00E676"
            dataPointsRadius={5}
            curved
            areaChart
            hideRules
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisLabel}
            noOfSections={4}
            maxValue={Math.max(...chartData.map(d => d.value)) * 1.2}
            isAnimated
          />

          <View style={styles.monthLabels}>
            {data.monthly_data.map((item, index) => (
              <Text key={index} style={styles.monthLabel}>{item.month}</Text>
            ))}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#004D4015' }]}>
              <DollarSign size={20} color="#004D40" />
            </View>
            <Text style={styles.statLabel}>Total Income</Text>
            <Text style={styles.statValue}>₵{data.total_income.toLocaleString()}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#BA1A1A15' }]}>
              <TrendingDown size={20} color="#BA1A1A" />
            </View>
            <Text style={styles.statLabel}>Total Expense</Text>
            <Text style={[styles.statValue, { color: '#BA1A1A' }]}>₵{data.total_expense.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.assetCard}>
          <View style={styles.assetHeader}>
            <PiggyBank size={24} color="#004D40" />
            <Text style={styles.assetTitle}>Asset Goal: New Vehicle</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '35%' }]} />
            </View>
            <Text style={styles.progressText}>₵15,000 / ₵50,000</Text>
          </View>
          
          <Text style={styles.assetSubtext}>35% complete • Est. completion: 2028</Text>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Mindset Insight</Text>
          <Text style={styles.insightText}>
            Despite a slow February, your wealth trajectory remains positive. 
            At your current rate, you're building toward financial independence. 
            Keep focusing on the long-term vision.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  projectionCard: {
    backgroundColor: '#004D40',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  projectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  projectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  projectionAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  projectionYear: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  projectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  projectionBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
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
  axisText: {
    fontSize: 10,
    color: '#74777F',
  },
  axisLabel: {
    fontSize: 10,
    color: '#74777F',
    marginTop: 8,
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  monthLabel: {
    fontSize: 12,
    color: '#74777F',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#74777F',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#004D40',
  },
  assetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  assetSubtext: {
    fontSize: 12,
    color: '#74777F',
  },
  insightCard: {
    backgroundColor: '#0D9488',
    borderRadius: 20,
    padding: 20,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});

export default AnnualVisionScreen;