import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, ShieldAlert, PiggyBank } from 'lucide-react-native';

const SafetyNet = ({ savingsAmount = 0, targetAmount = 500, isActive = false }) => {
  const formatCurrency = (value) => `₵${value.toFixed(2)}`;
  const progress = Math.min((savingsAmount / targetAmount) * 100, 100);
  const isFullyFunded = savingsAmount >= targetAmount;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, isFullyFunded ? styles.activeBox : styles.inactiveBox]}>
          {isFullyFunded ? (
            <ShieldCheck size={16} color="#FFF" />
          ) : (
            <PiggyBank size={16} color="#004D40" />
          )}
        </View>
        <Text style={styles.headerTitle}>Prosper Safety Net</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusRow}>
          {isFullyFunded ? (
            <>
              <ShieldCheck size={18} color="#10B981" />
              <Text style={styles.statusActive}>Fully Funded</Text>
            </>
          ) : (
            <>
              <ShieldAlert size={18} color="#F59E0B" />
              <Text style={styles.statusInactive}>Building Safety Net</Text>
            </>
          )}
        </View>

        <Text style={styles.amountText}>{formatCurrency(savingsAmount)}</Text>
        
        {!isFullyFunded && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        )}
        
        <Text style={styles.targetText}>
          {isFullyFunded 
            ? `Emergency fund ready` 
            : `₵${(targetAmount - savingsAmount).toFixed(2)} to target`
          }
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBox: {
    backgroundColor: '#10B981',
  },
  inactiveBox: {
    backgroundColor: '#E0F2F1',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  content: {
    gap: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  statusInactive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
  },
  amountText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1C1E',
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#004D40',
    borderRadius: 3,
  },
  targetText: {
    fontSize: 11,
    color: '#74777F',
    marginTop: 4,
  },
});

export default SafetyNet;