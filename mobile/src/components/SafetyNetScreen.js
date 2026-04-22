import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Shield, ShieldCheck, AlertTriangle, TrendingUp, ArrowRight, ArrowLeft, Plus, Check } from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const risksData = [
  { id: 1, name: 'Tire Replacement', cost: 450, covered: true },
  { id: 2, name: 'Major Engine Service', cost: 1200, covered: false, partial: 720 },
  { id: 3, name: 'Health Emergency', cost: 800, covered: true },
  { id: 4, name: 'License Renewal', cost: 300, covered: true },
  { id: 5, name: 'Transmission Repair', cost: 2000, covered: false, partial: 0 },
];

const SafetyNetScreen = () => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);
  const safetyNet = useFinanceStore((state) => state.safetyNet);
  const setSafetyNet = useFinanceStore((state) => state.setSafetyNet);
  const safetyNetTarget = useFinanceStore((state) => state.safetyNetTarget);

  const [autoSave, setAutoSave] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUp, setShowTopUp] = useState(false);

  const currentNet = safetyNet || 2400;
  const target = safetyNetTarget || 5000;
  const progress = (currentNet / target) * 100;
  const daysCovered = Math.floor(currentNet / 50);
  
  const gap = target - currentNet;
  const unprotectedRisks = risksData.filter(r => !r.covered);
  const status = progress >= 80 ? 'Fully Protected' : progress >= 50 ? 'Partially Covered' : 'Vulnerable';
  const statusColor = progress >= 80 ? '#10B981' : progress >= 50 ? '#F59E0B' : '#BA1A1A';

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  const handleTopUp = () => {
    if (topUpAmount) {
      const amount = parseInt(topUpAmount);
      setSafetyNet(currentNet + amount);
      setTopUpAmount('');
      setShowTopUp(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety Net</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.shieldCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <ShieldCheck size={16} color="#FFFFFF" />
            <Text style={styles.statusBadgeText}>{status}</Text>
          </View>
          
          <Text style={styles.balance}>₵{currentNet.toLocaleString()}</Text>
          <Text style={styles.subtext}>Covers ~{daysCovered} days of operations</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: statusColor }]} />
            </View>
            <Text style={styles.progressText}>{progress.toFixed(0)}% of ₵{target.toLocaleString()} target</Text>
          </View>

          <TouchableOpacity style={styles.topUpBtn} onPress={() => setShowTopUp(!showTopUp)}>
            <Plus size={18} color="#004D40" />
            <Text style={styles.topUpBtnText}>Top Up</Text>
          </TouchableOpacity>

          {showTopUp && (
            <View style={styles.topUpForm}>
              <View style={styles.inputRow}>
                <Text style={styles.currencyPrefix}>₵</Text>
                <TextInput
                  style={styles.inputField}
                  value={topUpAmount}
                  onChangeText={setTopUpAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#C4C4C4"
                />
              </View>
              <TouchableOpacity 
                style={[styles.addBtn, (!topUpAmount || parseFloat(topUpAmount) <= 0) && styles.addBtnDisabled]} 
                onPress={handleTopUp}
                disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
              >
                <Text style={styles.addBtnText}>Add +₵{topUpAmount || 0}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {unprotectedRisks.length > 0 && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color="#BA1A1A" />
              <Text style={styles.alertTitle}>Potential Gap</Text>
            </View>
            <Text style={styles.alertDesc}>
              Your Safety Net is ₵{gap.toLocaleString()} short of full coverage.
              Add more to bridge the gap.
            </Text>
            <TouchableOpacity style={styles.actionLink}>
              <Text style={styles.linkText}>Bridge the gap</Text>
              <ArrowRight size={14} color="#004D40" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>What If Analysis</Text>
        <Text style={styles.sectionSubtitle}>What your Safety Net can cover right now</Text>

        {risksData.map((risk) => (
          <View key={risk.id} style={styles.riskCard}>
            <View style={styles.riskHeader}>
              {risk.covered ? (
                <View style={styles.coveredBadge}>
                  <Check size={14} color="#10B981" />
                </View>
              ) : (
                <View style={styles.uncoveredBadge}>
                  <AlertTriangle size={14} color="#BA1A1A" />
                </View>
              )}
              <Text style={styles.riskName}>{risk.name}</Text>
              <Text style={[styles.riskCost, !risk.covered && styles.riskCostAlert]}>
                ₵{risk.cost.toLocaleString()}
              </Text>
            </View>
            <View style={styles.riskProgress}>
              <View style={styles.riskProgressBg}>
                <View 
                  style={[
                    styles.riskProgressFill, 
                    { 
                      width: risk.covered ? '100%' : `${Math.min((currentNet / risk.cost) * 100, 100)}%`,
                      backgroundColor: risk.covered ? '#10B981' : '#F59E0B'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.riskStatus}>
                {risk.covered ? 'Covered' : `${((currentNet / risk.cost) * 100).toFixed(0)}% Covered`}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.settingCard}>
          <View style={styles.settingIcon}>
            <TrendingUp size={20} color="#004D40" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Auto-Save Surplus</Text>
            <Text style={styles.settingHint}>Move ₵5 from every ₵200+ day.</Text>
          </View>
          <View style={[styles.toggle, autoSave && styles.toggleActive]}>
            <View style={[styles.toggleThumb, autoSave && styles.toggleThumbActive]} />
          </View>
        </View>

        <View style={styles.insightCard}>
          <Shield size={20} color="#004D40" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>The Runway Mindset</Text>
            <Text style={styles.insightText}>
              Your Safety Net isn't savings—it's time off. {daysCovered} days means {daysCovered} days you can take if the car breaks down or you need to rest.
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
  shieldCard: {
    backgroundColor: '#004D40',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balance: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  topUpBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  topUpForm: {
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inputField: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 100,
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  alertCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#BA1A1A',
  },
  alertDesc: {
    fontSize: 13,
    color: '#74777F',
    marginBottom: 12,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#004D40',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#74777F',
    marginBottom: 16,
  },
  riskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coveredBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  uncoveredBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  riskName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  riskCost: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  riskCostAlert: {
    color: '#BA1A1A',
  },
  riskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riskProgressBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  riskProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  riskStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#74777F',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  settingHint: {
    fontSize: 12,
    color: '#74777F',
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#E0F2F1',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 20,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004D40',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: '#74777F',
    lineHeight: 18,
  },
});

export default SafetyNetScreen;