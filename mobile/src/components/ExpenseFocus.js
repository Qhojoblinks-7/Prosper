import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, Receipt } from 'lucide-react-native';

const ExpenseFocus = ({ topExpense = null, topExpenseAmount = 0 }) => {
  const formatCurrency = (value) => `₵${value.toFixed(2)}`;
  
  const defaultMessage = 'No expenses logged today';
  const hasExpense = topExpense && topExpenseAmount > 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Receipt size={16} color="#004D40" />
        </View>
        <Text style={styles.headerTitle}>Expense Focus</Text>
      </View>

      <View style={styles.content}>
        {hasExpense ? (
          <>
            <View style={styles.issueRow}>
              <AlertTriangle size={18} color="#F59E0B" />
              <Text style={styles.issueLabel}>Top Leak</Text>
            </View>
            <Text style={styles.categoryText}>{topExpense}</Text>
            <Text style={styles.amountText}>{formatCurrency(topExpenseAmount)}</Text>
          </>
        ) : (
          <Text style={styles.emptyText}>{defaultMessage}</Text>
        )}
      </View>

      {hasExpense && (
        <Text style={styles.insightText}>
          Consider reducing this to boost profit
        </Text>
      )}
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  content: {
    gap: 4,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  issueLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
    textTransform: 'uppercase',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  amountText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#BA1A1A',
  },
  emptyText: {
    fontSize: 14,
    color: '#74777F',
    fontStyle: 'italic',
  },
  insightText: {
    fontSize: 11,
    color: '#74777F',
    marginTop: 8,
  },
});

export default ExpenseFocus;