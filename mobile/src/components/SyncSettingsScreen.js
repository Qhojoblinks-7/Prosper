import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { RefreshCw, Database, CloudCheck, Wifi, WifiOff, ArrowLeft, Check, AlertCircle } from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const SyncSettingsScreen = () => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);
  const setSynced = useFinanceStore((state) => state.setSynced);
  const markAllSynced = useFinanceStore((state) => state.markAllSynced);
  const addNotification = useFinanceStore((state) => state.addNotification);
  const transactions = useFinanceStore((state) => state.transactions);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Today at 2:15 PM');
  const [wifiOnly, setWifiOnly] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const queueCount = transactions.filter(t => !t.synced).length;
  
  const spinValue = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  const startSync = () => {
    setIsSyncing(true);
    setSynced(false);
    addNotification({
      title: 'Sync Started',
      body: 'Syncing your financial data to the cloud...',
      type: 'sync',
    });
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    setTimeout(() => {
      setIsSyncing(false);
      setSynced(true);
      markAllSynced();
      spinValue.stopAnimation();
      spinValue.setValue(0);
      setLastSync(new Date().toLocaleString());
      addNotification({
        title: 'Sync Complete',
        body: `${queueCount} log${queueCount !== 1 ? 's' : ''} synced to cloud.`,
        type: 'success',
      });
    }, 3000);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sync Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.syncHero}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <TouchableOpacity 
              style={styles.syncButton} 
              onPress={startSync} 
              disabled={isSyncing}
            >
              <RefreshCw 
                size={64} 
                color={isSyncing ? '#10B981' : '#004D40'} 
                strokeWidth={1.5} 
              />
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={styles.syncStatus}>
            {isSyncing ? 'Syncing with Cloud...' : 'All Data Protected'}
          </Text>
          
          <View style={styles.lastSyncBadge}>
            <CloudCheck size={14} color="#10B981" />
            <Text style={styles.lastSyncText}>Last synced: {lastSync}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.miniCard}>
            <View style={styles.miniIconBox}>
              <Database size={20} color="#004D40" />
            </View>
            <Text style={styles.miniLabel}>Local Cache</Text>
            <Text style={styles.miniValue}>124 KB</Text>
          </View>
          
          <View style={styles.miniCard}>
            <View style={[styles.miniIconBox, { backgroundColor: '#D1FAE5' }]}>
              <CloudCheck size={20} color="#10B981" />
            </View>
            <Text style={styles.miniLabel}>Cloud Status</Text>
            <Text style={styles.miniValue}>Synced</Text>
          </View>
        </View>

        {queueCount > 0 && (
          <View style={styles.queueCard}>
            <View style={styles.queueHeader}>
              <AlertCircle size={18} color="#F59E0B" />
              <Text style={styles.queueTitle}>Pending Uploads</Text>
            </View>
            <Text style={styles.queueDesc}>{queueCount} transactions waiting to sync</Text>
            <TouchableOpacity style={styles.queueBtn} onPress={startSync}>
              <Text style={styles.queueBtnText}>Sync Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Connectivity</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingIconBox}>
            <Wifi size={20} color="#004D40" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Wi-Fi Only Sync</Text>
            <Text style={styles.settingHint}>Save mobile data costs</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggle, wifiOnly && styles.toggleActive]}
            onPress={() => setWifiOnly(!wifiOnly)}
          >
            <View style={[styles.toggleThumb, wifiOnly && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingCard}>
          <View style={[styles.settingIconBox, { backgroundColor: '#E0F2F1' }]}>
            <RefreshCw size={20} color="#004D40" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Auto-Sync on Close</Text>
            <Text style={styles.settingHint}>Sync every time you leave the app</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggle, autoSync && styles.toggleActive]}
            onPress={() => setAutoSync(!autoSync)}
          >
            <View style={[styles.toggleThumb, autoSync && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Sync History</Text>

        <View style={styles.historyCard}>
          <View style={styles.historyRow}>
            <View style={styles.historyIconBox}>
              <Check size={16} color="#10B981" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Transactions Synced</Text>
              <Text style={styles.historyMeta}>15 items • Today at 2:15 PM</Text>
            </View>
          </View>
          
          <View style={styles.historyRow}>
            <View style={styles.historyIconBox}>
              <Check size={16} color="#10B981" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Settings Updated</Text>
              <Text style={styles.historyMeta}>Targets & Vaults • Yesterday</Text>
            </View>
          </View>
          
          <View style={styles.historyRow}>
            <View style={[styles.historyIconBox, { backgroundColor: '#D1FAE5' }]}>
              <CloudCheck size={16} color="#10B981" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Full Backup Complete</Text>
              <Text style={styles.historyMeta}>April 19, 2026 • 8:30 AM</Text>
            </View>
          </View>
        </View>

        <View style={styles.insightCard}>
          <CloudCheck size={20} color="#004D40" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Your Data is Safe</Text>
            <Text style={styles.insightText}>
              Every entry is synced to the cloud before it leaves your phone. A lost device won't cost you your financial history.
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
  syncHero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  syncButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  syncStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 8,
  },
  lastSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastSyncText: {
    fontSize: 12,
    color: '#74777F',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  miniCard: {
    flex: 1,
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
  miniIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniLabel: {
    fontSize: 11,
    color: '#74777F',
    marginBottom: 4,
  },
  miniValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  queueCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  queueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  queueDesc: {
    fontSize: 12,
    color: '#74777F',
    marginBottom: 12,
  },
  queueBtn: {
    backgroundColor: '#004D40',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  queueBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 16,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingIconBox: {
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
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7F8',
  },
  historyIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  historyMeta: {
    fontSize: 12,
    color: '#74777F',
    marginTop: 2,
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

export default SyncSettingsScreen;