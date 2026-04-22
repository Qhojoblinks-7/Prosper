import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Banknote, Smartphone, TrendingUp } from 'lucide-react-native';

const LiquidityCards = ({ 
  cashOnHand = 150.00, 
  digitalBalance = 420.50, 
  digitalTrend = 7.2,
  isCashBalanced = true 
}) => {
  const formatCurrency = (value) => {
    return `₵${value.toFixed(2)}`;
  };

  const formatTrend = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <View style={styles.row}>
      <View style={styles.miniCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>Cash on Hand</Text>
          <Banknote size={16} color="#004D40" strokeWidth={2.5} />
        </View>
        <Text style={styles.value}>{formatCurrency(cashOnHand)}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, isCashBalanced ? styles.greenDot : styles.redDot]} />
          <Text style={styles.statusText}>
            {isCashBalanced ? 'Balanced' : 'Check Pocket'}
          </Text>
        </View>
      </View>

      <View style={styles.miniCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>Digital Balance</Text>
          <Smartphone size={16} color="#004D40" strokeWidth={2.5} />
        </View>
        <Text style={styles.value}>{formatCurrency(digitalBalance)}</Text>
        <View style={styles.trendRow}>
          <TrendingUp size={14} color="#006A60" strokeWidth={2.5} />
          <Text style={styles.trendText}>{formatTrend(digitalTrend)} today</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 16,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#74777F',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  greenDot: {
    backgroundColor: '#10B981',
  },
  redDot: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#44474E',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#006A60',
  },
});

export default LiquidityCards;