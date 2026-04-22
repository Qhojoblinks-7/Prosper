import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Shield, ShieldCheck, Car, Home, TrendingUp, ArrowLeft, Plus, Minus, X } from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const vaultsData = [
  { id: 1, name: 'Emergency Net', amount: 2500, goal: 5000, icon: ShieldCheck, color: '#BA1A1A', description: 'Safety buffer for unexpected expenses' },
  { id: 2, name: 'Vehicle Upgrade', amount: 8000, goal: 20000, icon: Car, color: '#004D40', description: 'Next vehicle or major repair' },
  { id: 3, name: 'School Fees', amount: 1500, goal: 3000, icon: Home, color: '#F59E0B', description: 'Education and family goals' },
  { id: 4, name: 'Business Growth', amount: 500, goal: 10000, icon: TrendingUp, color: '#10B981', description: 'Expansion and opportunities' },
];

const SavingsVaultsScreen = () => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);
  const [vaults, setVaults] = useState(vaultsData);
  const [selectedVault, setSelectedVault] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);

  const totalSaved = vaults.reduce((sum, v) => sum + v.amount, 0);
  const totalGoals = vaults.reduce((sum, v) => sum + v.goal, 0);
  const daysOfFreedom = Math.floor(totalSaved / 50);

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  const handleVaultPress = (vault) => {
    if (selectedVault?.id === vault.id) {
      setSelectedVault(null);
      setShowTransfer(false);
    } else {
      setSelectedVault(vault);
      setTransferAmount('');
      setShowTransfer(true);
    }
  };

  const handleTransfer = () => {
    if (selectedVault && transferAmount) {
      const amount = parseInt(transferAmount);
      setVaults(vaults.map(v => 
        v.id === selectedVault.id 
          ? { ...v, amount: v.amount + amount }
          : v
      ));
      setSelectedVault(null);
      setTransferAmount('');
      setShowTransfer(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Savings Vaults</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Saved</Text>
          <Text style={styles.totalAmount}>₵{totalSaved.toLocaleString()}</Text>
          <View style={styles.freedomBadge}>
            <Shield size={16} color="#10B981" />
            <Text style={styles.freedomText}>{daysOfFreedom} days of freedom</Text>
          </View>
          <Text style={styles.goalProgress}>{((totalSaved / totalGoals) * 100).toFixed(0)}% of total goals</Text>
        </View>

        <Text style={styles.sectionTitle}>Your Vaults</Text>

        {vaults.map((vault) => {
          const Icon = vault.icon;
          const progress = (vault.amount / vault.goal) * 100;
          const isSelected = selectedVault?.id === vault.id;
          const isLow = progress < 30;

          return (
            <TouchableOpacity
              key={vault.id}
              style={[styles.vaultCard, isSelected && styles.vaultCardSelected]}
              onPress={() => handleVaultPress(vault)}
              activeOpacity={0.7}
            >
              <View style={styles.vaultHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${vault.color}15` }]}>
                  <Icon size={20} color={vault.color} />
                </View>
                <View style={styles.vaultInfo}>
                  <Text style={styles.vaultName}>{vault.name}</Text>
                  <Text style={styles.vaultDesc}>{vault.description}</Text>
                </View>
                <View style={styles.amountBadge}>
                  <Text style={styles.vaultAmount}>₵{vault.amount.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${Math.min(progress, 100)}%`, 
                        backgroundColor: isLow ? '#F59E0B' : vault.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{progress.toFixed(0)}% of ₵{vault.goal.toLocaleString()}</Text>
              </View>

              {isSelected && showTransfer && (
                <View style={styles.transferForm}>
                  <Text style={styles.transferLabel}>Add to vault</Text>
                  <View style={styles.transferInput}>
                    <Text style={styles.currencyPrefix}>₵</Text>
                    <TextInput
                      style={styles.amountField}
                      value={transferAmount}
                      onChangeText={setTransferAmount}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#C4C4C4"
                    />
                  </View>
                  <TouchableOpacity 
                    style={[styles.transferBtn, (!transferAmount || parseFloat(transferAmount) <= 0) && styles.transferBtnDisabled]} 
                    onPress={handleTransfer}
                    disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                  >
                    <Plus size={18} color="#FFFFFF" />
                    <Text style={styles.transferBtnText}>Add +₵{transferAmount || 0}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.tipCard}>
          <Shield size={20} color="#004D40" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>The Vault Barrier</Text>
            <Text style={styles.tipText}>
              Named money is harder to spend. Each vault is a promise to your future self.
            </Text>
          </View>
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
  totalCard: {
    backgroundColor: '#004D40',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  freedomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 8,
  },
  freedomText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  goalProgress: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 16,
  },
  vaultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  vaultCardSelected: {
    borderWidth: 2,
    borderColor: '#004D40',
  },
  vaultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vaultInfo: {
    flex: 1,
  },
  vaultName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  vaultDesc: {
    fontSize: 12,
    color: '#74777F',
    marginTop: 2,
  },
  amountBadge: {
    backgroundColor: '#004D40',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  vaultAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#74777F',
  },
  transferForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F7F8',
  },
  transferLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
    marginBottom: 12,
  },
  transferInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004D40',
  },
  amountField: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1C1E',
    paddingVertical: 12,
  },
  transferBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  transferBtnDisabled: {
    backgroundColor: '#C4C4C4',
  },
  transferBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#E0F2F1',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004D40',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#74777F',
    lineHeight: 18,
  },
});

export default SavingsVaultsScreen;