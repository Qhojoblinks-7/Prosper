import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { Menu, Bell, CloudCheck, CloudOff, RefreshCw, CloudUpload } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore } from '../../store/useFinanceStore';
import AlertCenter from './AlertCenter';
import NetInfo from '@react-native-community/netinfo';

const Header = ({ onMenuPress }) => {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSyncing, setIsSyncingLocal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const isSynced = useFinanceStore((state) => state.isSynced);
  const dailyGoal = useFinanceStore((state) => state.dailyGoal);
  const cashOnHand = useFinanceStore((state) => state.cashOnHand);
  const safetyNet = useFinanceStore((state) => state.safetyNet);
  const safetyNetTarget = useFinanceStore((state) => state.safetyNetTarget);
  const isShiftActive = useFinanceStore((state) => state.isShiftActive);
  const transactions = useFinanceStore((state) => state.transactions);
  const setSynced = useFinanceStore((state) => state.setSynced);
  const addNotification = useFinanceStore((state) => state.addNotification);
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);

  const pendingCount = transactions.filter(t => !t.synced).length;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isSyncing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
    return () => {
      spinAnim.stopAnimation();
    };
  }, [isSyncing, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getDotStatus = () => {
    if (!isOnline) return 'critical';
    if (pendingCount > 0) return 'warning';
    const goalGap = dailyGoal - cashOnHand;
    if (goalGap > 0 && goalGap <= 150 && isShiftActive) return 'warning';
    const safetyPercent = (safetyNet / safetyNetTarget) * 100;
    if (safetyPercent < 30) return 'warning';
    return null;
  };

  const dotStatus = getDotStatus();

  const getSyncStatus = () => {
    if (isSyncing) return 'syncing';
    if (!isOnline) return 'offline';
    if (pendingCount > 0) return 'pending';
    return 'synced';
  };

  const getSyncMessage = () => {
    const status = getSyncStatus();
    switch (status) {
      case 'syncing':
        return 'Syncing your data to the cloud...';
      case 'offline':
        return `Offline - ${pendingCount} pending log${pendingCount !== 1 ? 's' : ''}`;
      case 'pending':
        return `${pendingCount} log${pendingCount !== 1 ? 's' : ''} waiting to sync`;
      default:
        return 'All systems go';
    }
  };

  const handleBellPress = () => {
    setShowAlerts(true);
  };

  const handleSyncPress = () => {
    setShowSyncModal(true);
  };

  const handleSyncNow = () => {
    if (!isOnline || isSyncing) return;
    setIsSyncingLocal(true);
    setSynced(false);
    addNotification({
      title: 'Sync Started',
      body: 'Syncing your financial data to the cloud...',
      type: 'sync',
    });
    setTimeout(() => {
      setIsSyncingLocal(false);
      setSynced(true);
      addNotification({
        title: 'Sync Complete',
        body: 'All your data has been safely backed up.',
        type: 'success',
      });
    }, 3000);
  };

  const handleGoToSyncSettings = () => {
    setShowSyncModal(false);
    setTimeout(() => {
      setCurrentScreen('SyncSettings');
    }, 100);
  };

  const SyncIcon = () => {
    const status = getSyncStatus();
    if (status === 'syncing') {
      return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <CloudUpload size={20} color="#F59E0B" />
        </Animated.View>
      );
    }
    if (status === 'offline') {
      return <CloudOff size={20} color="#BA1A1A" />;
    }
    if (status === 'pending') {
      return <CloudUpload size={20} color="#F59E0B" />;
    }
    return <CloudCheck size={20} color="#10B981" />;
  };

  const getSyncDotColor = () => {
    const status = getSyncStatus();
    if (status === 'offline') return '#BA1A1A';
    if (status === 'pending' || status === 'syncing') return '#F59E0B';
    return '#10B981';
  };

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.leftSection}>
            <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
              <Menu size={24} color="#1A1C1E" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.logoText}>Prosper</Text>
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity onPress={handleBellPress} style={styles.iconButton}>
              <Bell size={22} color={dotStatus ? '#1A1C1E' : '#44474E'} />
              {dotStatus && (
                <View style={[
                  styles.notificationDot,
                  dotStatus === 'critical' ? styles.dotCritical : styles.dotWarning
                ]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSyncPress} style={styles.statusCircle}>
              <SyncIcon />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <AlertCenter 
        visible={showAlerts} 
        onClose={() => setShowAlerts(false)} 
      />

      <Modal
        visible={showSyncModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSyncModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setShowSyncModal(false)}
        >
          <View 
            style={styles.syncPopover}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.syncPopoverContent}>
              <View style={styles.syncStatusRow}>
                <View style={[styles.syncDot, { backgroundColor: getSyncDotColor() }]} />
                <Text style={styles.syncStatusText}>{getSyncMessage()}</Text>
              </View>

              <View style={styles.syncDivider} />

              <View style={styles.storageInfo}>
                <CloudCheck size={16} color="#10B981" />
                <Text style={styles.storageText}>
                  ₵{cashOnHand} synced to 2026 Vision
                </Text>
              </View>

              {pendingCount > 0 && isOnline && (
                <TouchableOpacity style={styles.syncNowButton} onPress={handleSyncNow}>
                  <RefreshCw size={16} color="#004D40" />
                  <Text style={styles.syncNowText}>Sync Now</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.viewSettingsLink} onPress={handleGoToSyncSettings}>
                <Text style={styles.viewSettingsText}>View Sync Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F7F8',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#004D40',
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#F5F7F8',
  },
  dotCritical: {
    backgroundColor: '#BA1A1A',
  },
  dotWarning: {
    backgroundColor: '#F59E0B',
  },
  statusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncPopover: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 220,
  },
  syncPopoverContent: {
    padding: 16,
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  syncDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  syncStatusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  syncDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  storageText: {
    fontSize: 13,
    color: '#74777F',
  },
  syncNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  syncNowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004D40',
  },
  viewSettingsLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewSettingsText: {
    fontSize: 13,
    color: '#74777F',
    textDecorationLine: 'underline',
  },
});

export default Header;