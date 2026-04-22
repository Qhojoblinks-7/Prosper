import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { ArrowLeft, Target, TrendingUp, Info, PieChart, Calendar, ArrowRight, Plus, Check, Minus, PlusCircle, MinusCircle } from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const SetTargetsScreen = () => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);
  const [dailyGoal, setDailyGoal] = useState(400);
  const [autoAllocate, setAutoAllocate] = useState(true);
  const [allocations, setAllocations] = useState([
    { id: 1, label: 'Operating Costs', percent: 50, color: '#F59E0B' },
    { id: 2, label: 'Business Growth', percent: 20, color: '#10B981' },
    { id: 3, label: 'Safety Net', percent: 10, color: '#004D40' },
    { id: 4, label: 'Personal/Home', percent: 20, color: '#8B5CF6' },
  ]);
  const [milestones, setMilestones] = useState([
    { id: 1, name: 'License Renewal', target: 800, current: 350, deadline: 'June 15', daysLeft: 55 },
    { id: 2, name: 'New Tire Set', target: 1200, current: 200, deadline: 'Aug 30', daysLeft: 101 },
  ]);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneTarget, setNewMilestoneTarget] = useState('');
  const [newMilestoneDeadline, setNewMilestoneDeadline] = useState('');
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');

  const handleMilestonePress = (milestone) => {
    if (expandedMilestone?.id === milestone.id) {
      setExpandedMilestone(null);
    } else {
      setExpandedMilestone(milestone);
      setContributionAmount('');
    }
  };

const handleAddContribution = () => {
    if (expandedMilestone && contributionAmount) {
      const amount = parseInt(contributionAmount);
      setMilestones(milestones.map(m => 
        m.id === expandedMilestone.id 
          ? { ...m, current: m.current + amount }
          : m
      ));
      setExpandedMilestone(null);
      setContributionAmount('');
    }
  };

  const handleSaveTargets = () => {
    setTargetsSaved({
      dailyGoal,
      allocations,
      milestones,
    });
    setCurrentScreen('Home');
  };

  const setTargetsSaved = useFinanceStore((state) => state.setTargetsSaved);
  const adjustDailyGoal = (delta) => {
    const newValue = dailyGoal + delta;
    if (newValue >= 100 && newValue <= 1000) {
      setDailyGoal(newValue);
    }
  };

  const totalPercent = allocations.reduce((sum, a) => sum + a.percent, 0);
  const grossRequired = Math.round(dailyGoal / (1 - (allocations[0].percent / 100)));

  const handleAllocationChange = (id, value) => {
    setAllocations(allocations.map(a => a.id === id ? { ...a, percent: value } : a));
  };

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Targets</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Target Command Center</Text>
        <Text style={styles.subtitle}>Define your business architecture</Text>

        <View style={styles.targetCard}>
          <View style={styles.cardHeader}>
            <Target size={20} color="#004D40" />
            <Text style={styles.cardTitle}>Daily Profit Target</Text>
          </View>
          
          <View style={styles.goalDisplay}>
            <TouchableOpacity 
              style={styles.adjustBtn} 
              onPress={() => adjustDailyGoal(-50)}
            >
              <MinusCircle size={32} color="#004D40" />
            </TouchableOpacity>
            
            <Text style={styles.goalValue}>₵{dailyGoal.toFixed(0)}</Text>
            
            <TouchableOpacity 
              style={styles.adjustBtn} 
              onPress={() => adjustDailyGoal(50)}
            >
              <PlusCircle size={32} color="#004D40" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sliderContainer}>
            {[100, 250, 400, 550, 700, 850, 1000].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.sliderDot,
                  dailyGoal >= value && styles.sliderDotActive
                ]}
                onPress={() => setDailyGoal(value)}
              />
            ))}
          </View>
          
          <View style={styles.infoBox}>
            <Info size={14} color="#74777F" />
            <Text style={styles.infoText}>
              To take home ₵{dailyGoal}, gross revenue must be ~₵{grossRequired} (after ₵{grossRequired - dailyGoal} operating costs)
            </Text>
          </View>
        </View>

        <View style={styles.allocationCard}>
          <View style={styles.cardHeader}>
            <PieChart size={20} color="#004D40" />
            <Text style={styles.cardTitle}>Income Allocation</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>{totalPercent}%</Text>
            </View>
          </View>
          
          <Text style={styles.allocationSub}>How every Cedi earned is split</Text>
          
          {allocations.map((item) => (
            <View key={item.id} style={styles.allocationRow}>
              <View style={[styles.allocationDot, { backgroundColor: item.color }]} />
              <Text style={styles.allocationLabel}>{item.label}</Text>
              <View style={styles.allocationControl}>
                <TouchableOpacity 
                  style={styles.percentBtn}
                  onPress={() => handleAllocationChange(item.id, Math.max(0, item.percent - 5))}
                >
                  <Minus size={14} color={item.color} />
                </TouchableOpacity>
                <Text style={[styles.allocationInput, { color: item.color }]}>
                  {item.percent}
                </Text>
                <TouchableOpacity 
                  style={styles.percentBtn}
                  onPress={() => handleAllocationChange(item.id, Math.min(100, item.percent + 5))}
                >
                  <Plus size={14} color={item.color} />
                </TouchableOpacity>
                <Text style={[styles.allocationPercent, { color: item.color }]}>%</Text>
              </View>
            </View>
          ))}
          
          <View style={styles.pieVisual}>
            {allocations.map((item) => (
              <View 
                key={item.id}
                style={[
                  styles.pieSlice,
                  { 
                    backgroundColor: item.color,
                    flex: item.percent,
                  }
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.textGroup}>
            <Text style={styles.settingTitle}>Auto-allocate Income</Text>
            <Text style={styles.settingSub}>Automatically move digital earnings to vaults</Text>
          </View>
          <Switch 
            trackColor={{ false: '#E5E7EB', true: '#10B981' }}
            thumbColor="#FFFFFF"
            value={autoAllocate}
            onValueChange={setAutoAllocate}
          />
        </View>

        <View style={styles.milestonesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Milestone Trackers</Text>
            <TouchableOpacity style={styles.addMilestoneBtn} onPress={() => setShowAddMilestone(true)}>
              <Plus size={16} color="#004D40" />
            </TouchableOpacity>
          </View>



          {showAddMilestone && (
            <View style={styles.addMilestoneForm}>
              <Text style={styles.formTitle}>Add New Milestone</Text>
              
              <TextInput
                style={styles.formInput}
                value={newMilestoneName}
                onChangeText={setNewMilestoneName}
                placeholder="Milestone name (e.g., New Battery)"
                placeholderTextColor="#C4C4C4"
              />
              
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Target Amount</Text>
                  <View style={styles.amountInput}>
                    <Text style={styles.currencyPrefix}>₵</Text>
                    <TextInput
                      style={styles.amountField}
                      value={newMilestoneTarget}
                      onChangeText={setNewMilestoneTarget}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#C4C4C4"
                    />
                  </View>
                </View>
                
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Deadline</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={newMilestoneDeadline}
                    onChangeText={setNewMilestoneDeadline}
                    placeholder="June 30"
                    placeholderTextColor="#C4C4C4"
                  />
                </View>
              </View>
              
              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => {
                    setShowAddMilestone(false);
                    setNewMilestoneName('');
                    setNewMilestoneTarget('');
                    setNewMilestoneDeadline('');
                  }}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleAddMilestone}>
                  <Text style={styles.saveBtnText}>Add Milestone</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {milestones.map((milestone) => {
            const progress = (milestone.current / milestone.target) * 100;
            const dailyNeeded = Math.round((milestone.target - milestone.current) / milestone.daysLeft);
            const isExpanded = expandedMilestone?.id === milestone.id;
            
            return (
              <View key={milestone.id} style={styles.milestoneCard}>
                <TouchableOpacity 
                  onPress={() => handleMilestonePress(milestone)}
                  activeOpacity={0.7}
                >
                  <View style={styles.milestoneHeader}>
                    <View>
                      <Text style={styles.milestoneName}>{milestone.name}</Text>
                      <Text style={styles.milestoneDeadline}>
                        {milestone.deadline} • {milestone.daysLeft} days left
                      </Text>
                    </View>
                    <View style={[styles.expandIcon, isExpanded && styles.expandIconActive]}>
                      <ArrowRight size={18} color={isExpanded ? '#FFFFFF' : '#C4C4C4'} />
                    </View>
                  </View>
                  
                  <View style={styles.milestoneProgress}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
                    </View>
                    <Text style={styles.progressText}>₵{milestone.current} / ₵{milestone.target}</Text>
                  </View>
                  
                  {!isExpanded && (
                    <View style={styles.dailyNeeded}>
                      <Text style={styles.dailyNeededLabel}>₵{dailyNeeded}/day needed to hit target</Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.expandedInputRow}>
                      <Text style={styles.expandedCurrency}>₵</Text>
                      <TextInput
                        style={styles.expandedInput}
                        value={contributionAmount}
                        onChangeText={setContributionAmount}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#C4C4C4"
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.expandedSaveBtn, (!contributionAmount || parseFloat(contributionAmount) <= 0) && styles.expandedSaveBtnDisabled]} 
                      onPress={handleAddContribution}
                      disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
                    >
                      <Text style={styles.expandedSaveBtnText}>Add +₵{contributionAmount || 0}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTargets}>
          <Check size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Targets</Text>
        </TouchableOpacity>
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
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#74777F',
    marginBottom: 24,
  },
  targetCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  goalDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  adjustBtn: {
    padding: 8,
  },
  goalValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#004D40',
    minWidth: 140,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sliderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  sliderDotActive: {
    backgroundColor: '#10B981',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F8',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#74777F',
    flex: 1,
  },
  allocationCard: {
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
  totalBadge: {
    backgroundColor: '#004D40',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  allocationSub: {
    fontSize: 12,
    color: '#74777F',
    marginBottom: 16,
  },
  allocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7F8',
  },
  allocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  allocationLabel: {
    flex: 1,
    fontSize: 14,
    color: '#1A1C1E',
  },
  allocationControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentBtn: {
    padding: 4,
  },
  allocationInput: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    minWidth: 32,
  },
  allocationPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  pieVisual: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  pieSlice: {
    height: '100%',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  textGroup: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  settingSub: {
    fontSize: 12,
    color: '#74777F',
    marginTop: 2,
  },
  milestonesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  addMilestoneBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6EEED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  expandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F7F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIconActive: {
    backgroundColor: '#004D40',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F7F8',
  },
  expandedInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  expandedCurrency: {
    fontSize: 32,
    fontWeight: '700',
    color: '#004D40',
  },
  expandedInput: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1C1E',
    minWidth: 100,
    textAlign: 'center',
  },
  expandedSaveBtn: {
    backgroundColor: '#004D40',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  expandedSaveBtnDisabled: {
    backgroundColor: '#C4C4C4',
  },
  expandedSaveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  milestoneDeadline: {
    fontSize: 12,
    color: '#74777F',
    marginTop: 4,
  },
  milestoneProgress: {
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#74777F',
  },
  dailyNeeded: {
    backgroundColor: '#F5F7F8',
    padding: 8,
    borderRadius: 8,
  },
  dailyNeededLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  addMilestoneForm: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 16,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#74777F',
    marginBottom: 20,
  },
  formInput: {
    backgroundColor: '#F5F7F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1C1E',
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formField: {
    flex: 1,
  },
  formLabel: {
    fontSize: 12,
    color: '#74777F',
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F8',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#74777F',
  },
  amountField: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
    paddingVertical: 14,
  },
  dateInput: {
    backgroundColor: '#F5F7F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1C1E',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F7F8',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#74777F',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#004D40',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SetTargetsScreen;