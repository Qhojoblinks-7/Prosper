import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
  Modal,
} from 'react-native';
import {
  X,
  AlertTriangle,
  Target,
  RefreshCw,
  TrendingUp,
  Award,
  Receipt,
  Clock,
  FileText,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Wrench,
  DollarSign,
} from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AlertCenter = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);
  const setSynced = useFinanceStore((state) => state.setSynced);
  const addNotification = useFinanceStore((state) => state.addNotification);
  const alerts = useFinanceStore((state) => state.alerts);
  const dismissAlert = useFinanceStore((state) => state.dismissAlert);
  const dailyGoal = useFinanceStore((state) => state.dailyGoal);
  const cashOnHand = useFinanceStore((state) => state.cashOnHand);
  const isShiftActive = useFinanceStore((state) => state.isShiftActive);
  const safetyNet = useFinanceStore((state) => state.safetyNet);
  const safetyNetTarget = useFinanceStore((state) => state.safetyNetTarget);
  const topExpenseAmount = useFinanceStore((state) => state.topExpenseAmount);
  const isSynced = useFinanceStore((state) => state.isSynced);
  const transactions = useFinanceStore((state) => state.transactions);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible, onClose]);

  const generateAlerts = () => {
    const generatedAlerts = [];

    generatedAlerts.push({
      id: 'sync-issue',
      title: 'Sync Issue',
      message: '3 logs haven\'t reached the cloud. Tap to retry.',
      category: 'action',
      priority: 'critical',
      action: { type: 'sync', label: 'Retry Sync' },
      icon: RefreshCw,
      color: '#BA1A1A',
    });

    generatedAlerts.push({
      id: 'maintenance-reminder',
      title: 'Maintenance Warning',
      message: 'Your oil life is at 10%. Schedule a change to avoid engine damage.',
      category: 'action',
      priority: 'critical',
      action: { type: 'vehicle', label: 'View Vehicle' },
      icon: Wrench,
      color: '#BA1A1A',
    });

    generatedAlerts.push({
      id: 'goal-gap',
      title: 'Goal Alert',
      message: "It's 4 PM and you're ₵100 away from your daily profit goal. Consider one more trip?",
      category: 'action',
      priority: 'high',
      action: { type: 'target', label: 'View Goals' },
      icon: Target,
      color: '#F59E0B',
    });

    generatedAlerts.push({
      id: 'milestone-reached',
      title: 'Milestone Reached!',
      message: "Congratulations! You just hit 50% of your 'New Car' savings goal.",
      category: 'insight',
      priority: 'normal',
      action: { type: 'savings', label: 'View Vault' },
      icon: Award,
      color: '#10B981',
    });

    generatedAlerts.push({
      id: 'expense-insight',
      title: 'Expense Insight',
      message: 'You spent ₵60 on snacks this week. That\'s 2 gallons of fuel. Just an observation.',
      category: 'insight',
      priority: 'normal',
      action: { type: 'insights', label: 'View Report' },
      icon: Receipt,
      color: '#10B981',
    });

    generatedAlerts.push({
      id: 'shift-wrap',
      title: 'Shift Reminder',
      message: "You've been active for 8 hours. Don't forget to log your final cash-on-hand before heading home.",
      category: 'systematic',
      priority: 'high',
      action: null,
      icon: Clock,
      color: '#F59E0B',
    });

    generatedAlerts.push({
      id: 'weekly-report',
      title: 'Weekly Report Ready',
      message: 'Your April Insight Report is ready for download.',
      category: 'systematic',
      priority: 'normal',
      action: { type: 'insights', label: 'Download' },
      icon: FileText,
      color: '#004D40',
    });

    generatedAlerts.push({
      id: 'safety-net-low',
      title: 'Safety Net Update',
      message: 'Your safety net is at 45%. You\'re ₵275 away from your ₵500 goal.',
      category: 'insight',
      priority: 'normal',
      action: { type: 'safety', label: 'Top Up' },
      icon: Award,
      color: '#004D40',
    });

    return generatedAlerts;
  };

  const activeAlerts = generateAlerts().filter(a => !a.dismissed);
  const criticalAlerts = activeAlerts.filter(a => a.priority === 'critical');
  const hasAchievement = activeAlerts.some(a => a.category === 'insight' && a.priority === 'normal');

  const handleAction = (alert) => {
    dismissAlert(alert.id);
    if (alert.action) {
      switch (alert.action.type) {
        case 'sync':
          setSynced(false);
          addNotification({
            title: 'Sync Started',
            body: 'Syncing your financial data to the cloud...',
            type: 'sync',
          });
          setTimeout(() => {
            setSynced(true);
            addNotification({
              title: 'Sync Complete',
              body: 'All your data has been safely backed up.',
              type: 'success',
            });
          }, 2000);
          break;
        case 'safety':
          setCurrentScreen('SafetyNet');
          break;
        case 'target':
          setCurrentScreen('SetTargets');
          break;
        case 'insights':
          setCurrentScreen('InsightReports');
          break;
        case 'savings':
          setCurrentScreen('SavingsVaults');
          break;
        case 'vehicle':
          setCurrentScreen('VehicleManagement');
          break;
      }
    }
    onClose();
  };

  const handleDismiss = (alertId) => {
    dismissAlert(alertId);
  };

  const getDotColor = () => {
    if (criticalAlerts.length > 0) return '#BA1A1A';
    if (hasAchievement) return '#10B981';
    return null;
  };

  const getDotColorValue = getDotColor();

  const AlertItem = ({ alert }) => {
    const IconComponent = alert.icon || AlertTriangle;
    return (
      <View style={[styles.alertCard, { borderLeftColor: alert.color }]}>
        <View style={[styles.alertIconBox, { backgroundColor: `${alert.color}15` }]}>
          <IconComponent size={20} color={alert.color} />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertMessage}>{alert.message}</Text>
          {alert.action && (
            <TouchableOpacity
              style={[styles.alertAction, { backgroundColor: `${alert.color}15` }]}
              onPress={() => handleAction(alert)}
            >
              <Text style={[styles.alertActionText, { color: alert.color }]}>
                {alert.action.label}
              </Text>
              <ChevronRight size={14} color={alert.color} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => handleDismiss(alert.id)}
        >
          <X size={16} color="#C4C4C4" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Alert Center</Text>
              {getDotColorValue && (
                <View style={[styles.statusDot, { backgroundColor: getDotColorValue }]} />
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#74777F" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {criticalAlerts.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <AlertTriangle size={16} color="#BA1A1A" />
                  <Text style={[styles.sectionTitle, { color: '#BA1A1A' }]}>
                    Immediate Action
                  </Text>
                </View>
                {criticalAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </View>
            )}

            {activeAlerts.filter(a => a.priority === 'high' || a.priority === 'medium').length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Wrench size={16} color="#F59E0B" />
                  <Text style={[styles.sectionTitle, { color: '#F59E0B' }]}>
                    Priority Items
                  </Text>
                </View>
                {activeAlerts
                  .filter(a => a.priority === 'high' || a.priority === 'medium')
                  .map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
              </View>
            )}

            {activeAlerts.filter(a => a.category === 'insight').length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Sparkles size={16} color="#10B981" />
                  <Text style={[styles.sectionTitle, { color: '#10B981' }]}>
                    Wealth Insights
                  </Text>
                </View>
                {activeAlerts
                  .filter(a => a.category === 'insight')
                  .map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
              </View>
            )}

            {activeAlerts.filter(a => a.category === 'systematic').length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={16} color="#74777F" />
                  <Text style={[styles.sectionTitle, { color: '#74777F' }]}>
                    Reminders
                  </Text>
                </View>
                {activeAlerts
                  .filter(a => a.category === 'systematic')
                  .map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
              </View>
            )}

            {activeAlerts.length === 0 && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconBox}>
                  <CheckCircle size={48} color="#10B981" />
                </View>
                <Text style={styles.emptyTitle}>All Clear!</Text>
                <Text style={styles.emptyText}>
                  No urgent alerts. You're on track with your financial goals.
                </Text>
              </View>
            )}

            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={() => {
                    setCurrentScreen('SyncSettings');
                    onClose();
                  }}
                >
                  <RefreshCw size={20} color="#004D40" />
                  <Text style={styles.quickActionText}>Sync Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={() => {
                    setCurrentScreen('SetTargets');
                    onClose();
                  }}
                >
                  <Target size={20} color="#004D40" />
                  <Text style={styles.quickActionText}>Set Goals</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={() => {
                    setCurrentScreen('SafetyNet');
                    onClose();
                  }}
                >
                  <Award size={20} color="#004D40" />
                  <Text style={styles.quickActionText}>Safety Net</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={() => {
                    setCurrentScreen('InsightReports');
                    onClose();
                  }}
                >
                  <FileText size={20} color="#004D40" />
                  <Text style={styles.quickActionText}>Insights</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    backgroundColor: '#F5F7F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#C4C4C4',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  alertIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    color: '#74777F',
    lineHeight: 18,
    marginBottom: 8,
  },
  alertAction: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#74777F',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActions: {
    marginTop: 8,
  },
  quickActionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#74777F',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1C1E',
    marginTop: 8,
  },
});

export default AlertCenter;