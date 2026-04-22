import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FileText, Download, TrendingUp, Filter, ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const filterOptions = [
  { id: 'yearly', label: 'Yearly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'monthly', label: 'Monthly' },
];

const InsightReportsScreen = () => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);
  const [activeFilter, setActiveFilter] = useState('yearly');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const dataByFilter = {
    yearly: {
      netMargin: '38.5%',
      netMarginTrend: '+2.4%',
      avgDaily: '₵342',
      avgDays: 'Last 30 days',
      totalIncome: '₵12,600',
      totalIncomeLabel: 'YTD 2026',
      activeDays: '55',
      activeDaysLabel: 'Working days',
    },
    quarterly: {
      netMargin: '36.2%',
      netMarginTrend: '+1.8%',
      avgDaily: '₵310',
      avgDays: 'Last 90 days',
      totalIncome: '₵9,800',
      totalIncomeLabel: 'Q1 2026',
      activeDays: '42',
      activeDaysLabel: 'Working days',
    },
    monthly: {
      netMargin: '34.8%',
      netMarginTrend: '-0.5%',
      avgDaily: '₵295',
      avgDays: 'Last 30 days',
      totalIncome: '₵3,200',
      totalIncomeLabel: 'March 2026',
      activeDays: '18',
      activeDaysLabel: 'Working days',
    },
  };

  const reportsByFilter = {
    yearly: [
      { name: '2025 Annual', month: '2025', size: '4.2 MB' },
      { name: '2024 Annual', month: '2024', size: '3.9 MB' },
      { name: 'Q4 2025', month: 'Q4', size: '3.8 MB' },
      { name: 'Q3 2025', month: 'Q3', size: '3.5 MB' },
    ],
    quarterly: [
      { name: 'Q1 2026', month: 'Q1', size: '3.2 MB' },
      { name: 'Q4 2025', month: 'Q4', size: '3.8 MB' },
      { name: 'Q3 2025', month: 'Q3', size: '3.5 MB' },
    ],
    monthly: [
      { name: 'March 2026', month: 'March', size: '1.2 MB' },
      { name: 'February 2026', month: 'February', size: '1.1 MB' },
      { name: 'January 2026', month: 'January', size: '1.3 MB' },
    ],
  };

  const currentData = dataByFilter[activeFilter];
  const reports = reportsByFilter[activeFilter];

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  const handleFilterPress = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const handleSelectFilter = (filterId) => {
    setActiveFilter(filterId);
    setShowFilterMenu(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insight Reports</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Financial Reports</Text>
          <TouchableOpacity style={styles.filterBtn} onPress={handleFilterPress}>
            <Filter size={18} color="#004D40" />
            <Text style={styles.filterText}>{filterOptions.find(f => f.id === activeFilter)?.label}</Text>
            <ChevronDown size={14} color="#004D40" />
          </TouchableOpacity>
        </View>

        {showFilterMenu && (
          <View style={styles.filterMenu}>
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterOption, activeFilter === filter.id && styles.filterOptionActive]}
                onPress={() => handleSelectFilter(filter.id)}
              >
                <Text style={[styles.filterOptionText, activeFilter === filter.id && styles.filterOptionTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Net Margin</Text>
            <Text style={styles.statsValue}>{currentData.netMargin}</Text>
            <View style={styles.trendTag}>
              <TrendingUp size={12} color="#10B981" />
              <Text style={styles.trendText}>{currentData.netMarginTrend}</Text>
            </View>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Avg. Daily</Text>
            <Text style={styles.statsValue}>{currentData.avgDaily}</Text>
            <Text style={styles.subLabel}>{currentData.avgDays}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Total Income</Text>
            <Text style={styles.statsValue}>{currentData.totalIncome}</Text>
            <Text style={styles.subLabel}>{currentData.totalIncomeLabel}</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Active Days</Text>
            <Text style={styles.statsValue}>{currentData.activeDays}</Text>
            <Text style={styles.subLabel}>{currentData.activeDaysLabel}</Text>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.listTitle}>
            {activeFilter === 'yearly' ? 'Annual Statements' : activeFilter === 'quarterly' ? 'Quarterly Statements' : 'Monthly Statements'}
          </Text>
          
          {reports.map((report, index) => (
            <TouchableOpacity key={index} style={styles.reportRow}>
              <View style={styles.reportIcon}>
                <FileText size={20} color="#004D40" />
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportName}>Income Statement - {report.name}</Text>
                <Text style={styles.reportMeta}>PDF • {report.size}</Text>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                <Download size={18} color="#004D40" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F8',
    position: 'relative',
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
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#004D40',
  },
  filterMenu: {
    position: 'absolute',
    top: 130,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 100,
    minWidth: 120,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  filterOptionActive: {
    backgroundColor: '#004D4015',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1C1E',
  },
  filterOptionTextActive: {
    color: '#004D40',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  statsLabel: {
    fontSize: 12,
    color: '#74777F',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  trendTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  trendText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
  subLabel: {
    fontSize: 10,
    color: '#C4C4C4',
    marginTop: 4,
  },
  listSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 16,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E6EEED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  reportMeta: {
    fontSize: 11,
    color: '#74777F',
    marginTop: 2,
  },
  downloadBtn: {
    padding: 8,
  },
});

export default InsightReportsScreen;