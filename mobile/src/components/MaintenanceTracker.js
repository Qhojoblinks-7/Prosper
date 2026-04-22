import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Calculator, Fuel, Wrench, User, ArrowRight } from 'lucide-react-native';

const MaintenanceTracker = ({ 
  transactions = [],
  fuelPercent = 40,
  maintenancePercent = 30,
  personalPercent = 30
}) => {
  const [goalAmount, setGoalAmount] = useState('');
  
  const formatCurrency = (value) => `₵${value.toFixed(2)}`;
  
  const calculateGoal = (amount) => {
    const value = parseFloat(amount) || 0;
    return {
      fuel: (value * fuelPercent) / 100,
      maintenance: (value * maintenancePercent) / 100,
      personal: (value * personalPercent) / 100,
    };
  };

  const goalResult = goalAmount ? calculateGoal(goalAmount) : null;

  const getCategoryIcon = (method) => {
    switch (method?.toUpperCase()) {
      case 'FUEL':
        return <Fuel size={14} color="#FBBF24" />;
      case 'MAINTENANCE':
        return <Wrench size={14} color="#74777F" />;
      default:
        return <User size={14} color="#004D40" />;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const defaultTransactions = [
    { id: 1, category: 'Shell Fuel', method: 'MOMO', amount: 150, time: '08:30 AM' },
    { id: 2, category: 'Lunch', method: 'CASH', amount: 25, time: '12:45 PM' },
    { id: 3, category: 'Tire Patch', method: 'MOMO', amount: 50, time: '02:15 PM' },
    { id: 4, category: 'Airtime', method: 'MOMO', amount: 10, time: '04:00 PM' },
  ];

  const displayTransactions = transactions.length > 0 ? transactions : defaultTransactions;

  return (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Maintenance & Goals</Text>

      <View style={styles.calculatorSection}>
        <View style={styles.calculatorHeader}>
          <Calculator size={16} color="#004D40" />
          <Text style={styles.calculatorTitle}>Goal Calculator</Text>
        </View>
        <Text style={styles.calculatorSubtitle}>
          "If I earn today, how much goes to savings?"
        </Text>
        
        <View style={styles.inputRow}>
          <Text style={styles.currencyPrefix}>₵</Text>
          <TextInput
            style={styles.input}
            placeholder="500"
            placeholderTextColor="#C4C4C4"
            keyboardType="numeric"
            value={goalAmount}
            onChangeText={setGoalAmount}
          />
          <Text style={styles.inputLabel}>Today's Goal</Text>
        </View>

        {goalResult && (
          <View style={styles.resultBox}>
            <View style={styles.resultItem}>
              <Fuel size={14} color="#FBBF24" />
              <Text style={styles.resultLabel}>Fuel</Text>
              <Text style={styles.resultValue}>{formatCurrency(goalResult.fuel)}</Text>
            </View>
            <View style={styles.resultItem}>
              <Wrench size={14} color="#74777F" />
              <Text style={styles.resultLabel}>Maintenance</Text>
              <Text style={styles.resultValue}>{formatCurrency(goalResult.maintenance)}</Text>
            </View>
            <View style={styles.resultItem}>
              <User size={14} color="#004D40" />
              <Text style={styles.resultLabel}>Personal</Text>
              <Text style={styles.resultValue}>{formatCurrency(goalResult.personal)}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.tableSection}>
        <Text style={styles.tableTitle}>This Week's Log</Text>
        
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.colCategory]}>Category</Text>
          <Text style={[styles.headerCell, styles.colMethod]}>Method</Text>
          <Text style={[styles.headerCell, styles.colAmount]}>Amount</Text>
          <Text style={[styles.headerCell, styles.colTime]}>Time</Text>
        </View>

        <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
          {displayTransactions.map((tx) => (
            <View key={tx.id} style={styles.tableRow}>
              <View style={[styles.cell, styles.colCategory]}>
                {getCategoryIcon(tx.method)}
                <Text style={styles.cellCategory}>{tx.category}</Text>
              </View>
              <Text style={[styles.cell, styles.colMethod, styles.cellMethod]}>
                {tx.method}
              </Text>
              <Text style={[styles.cell, styles.colAmount, styles.cellAmount]}>
                {formatCurrency(tx.amount)}
              </Text>
              <Text style={[styles.cell, styles.colTime, styles.cellTime]}>
                {tx.time || formatTime(tx.createdAt)}
              </Text>
            </View>
          ))}
        </ScrollView>
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
    marginBottom: 16,
  },
  calculatorSection: {
    backgroundColor: '#F8FAFA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  calculatorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  calculatorSubtitle: {
    fontSize: 11,
    color: '#74777F',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004D40',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
    padding: 0,
  },
  inputLabel: {
    fontSize: 11,
    color: '#74777F',
  },
  resultBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resultItem: {
    alignItems: 'center',
    gap: 4,
  },
  resultLabel: {
    fontSize: 10,
    color: '#74777F',
  },
  resultValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  tableSection: {
    flex: 1,
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C1E',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 4,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: '600',
    color: '#74777F',
    textTransform: 'uppercase',
  },
  tableBody: {
    maxHeight: 150,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  cell: {
    fontSize: 12,
    color: '#1A1C1E',
  },
  colCategory: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colMethod: {
    flex: 1,
    textAlign: 'center',
  },
  colAmount: {
    flex: 1,
    textAlign: 'right',
  },
  colTime: {
    flex: 0.8,
    textAlign: 'right',
  },
  cellCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1C1E',
  },
  cellMethod: {
    fontSize: 10,
    fontWeight: '500',
    color: '#74777F',
  },
  cellAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#004D40',
  },
  cellTime: {
    fontSize: 11,
    color: '#74777F',
  },
});

export default MaintenanceTracker;