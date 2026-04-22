import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Wrench, Fuel, AlertTriangle, Calendar, Car, Shield, Zap } from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const VehicleScreen = ({ navigation }) => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);

  const vehicleData = {
    nextServiceKm: 1250,
    totalKm: 45000,
    fuelEfficiency: 12.5,
    insuranceExpiry: 'Aug 20th',
    roadworthinessExpiry: 'Oct 15th',
    tireHealth: 'Good',
    maintenanceFund: 850,
    fundTarget: 2000,
    assetValue: 80000,
    healthScore: 85,
    recentLogs: [
      { item: 'Brake Pad Change', cost: 450, date: 'Mar 15' },
      { item: 'Oil Filter (Shell)', cost: 120, date: 'Feb 28' },
      { item: 'Tire Rotation', cost: 80, date: 'Feb 10' },
      { item: 'Air Filter', cost: 60, date: 'Jan 22' },
    ],
  };

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  const progressPercent = Math.min((vehicleData.maintenanceFund / vehicleData.fundTarget) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Car size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Management</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>Service Status</Text>
            <Wrench size={20} color="#004D40" />
          </View>
          <View style={styles.progressSection}>
            <View style={styles.kmCircle}>
              <Text style={styles.bigKm}>{vehicleData.nextServiceKm.toLocaleString()}</Text>
              <Text style={styles.kmLabel}>km remaining</Text>
            </View>
            <View style={styles.statsColumn}>
              <Text style={styles.totalKm}>Total: {vehicleData.totalKm.toLocaleString()} km</Text>
              <View style={[styles.healthBadge, { backgroundColor: '#10B981' }]}>
                <Shield size={12} color="#FFF" />
                <Text style={styles.healthBadgeText}>Healthy</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.miniCard}>
            <Fuel size={20} color="#F59E0B" />
            <Text style={styles.miniLabel}>Fuel Efficiency</Text>
            <Text style={styles.miniValue}>₵{vehicleData.fuelEfficiency} / km</Text>
          </View>
          <View style={styles.miniCard}>
            <Calendar size={20} color="#10B981" />
            <Text style={styles.miniLabel}>Insurance</Text>
            <Text style={styles.miniValue}>{vehicleData.insuranceExpiry}</Text>
          </View>
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.badgeCard}>
            <Shield size={16} color="#004D40" />
            <Text style={styles.badgeLabel}>Roadworthy</Text>
            <Text style={styles.badgeValue}>{vehicleData.roadworthinessExpiry}</Text>
          </View>
          <View style={styles.badgeCard}>
            <Zap size={16} color="#10B981" />
            <Text style={styles.badgeLabel}>Tire Health</Text>
            <Text style={[styles.badgeValue, { color: '#10B981' }]}>{vehicleData.tireHealth}</Text>
          </View>
        </View>

        <View style={styles.fundCard}>
          <View style={styles.fundHeader}>
            <Wrench size={24} color="#004D40" />
            <Text style={styles.fundTitle}>Maintenance Fund</Text>
          </View>
          <View style={styles.fundProgress}>
            <Text style={styles.fundAmount}>₵{vehicleData.maintenanceFund}</Text>
            <Text style={styles.fundTarget}>of ₵{vehicleData.fundTarget} target</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.fundSubtext}>{progressPercent.toFixed(0)}% ready for next service</Text>
        </View>

        <View style={styles.logCard}>
          <Text style={styles.logTitle}>Recent Repairs</Text>
          {vehicleData.recentLogs.map((log, index) => (
            <View key={index} style={[styles.logRow, index < vehicleData.recentLogs.length - 1 && styles.logRowBorder]}>
              <View>
                <Text style={styles.logItem}>{log.item}</Text>
                <Text style={styles.logDate}>{log.date}</Text>
              </View>
              <Text style={styles.logPrice}>₵{log.cost}</Text>
            </View>
          ))}
        </View>

        <View style={styles.assetCard}>
          <View style={styles.assetHeader}>
            <Car size={24} color="#10B981" />
            <Text style={styles.assetTitle}>Vehicle Appreciation</Text>
          </View>
          <View style={styles.assetScore}>
            <Text style={styles.assetScoreValue}>{vehicleData.healthScore}</Text>
            <Text style={styles.assetScoreLabel}>/ 100</Text>
          </View>
          <Text style={styles.assetValue}>Est. Resale Value: ₵{vehicleData.assetValue.toLocaleString()}</Text>
          <Text style={styles.assetInsight}>
            Good maintenance increases resale value. Keep logging repairs to protect this asset.
          </Text>
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
  mainCard: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kmCircle: {
    alignItems: 'center',
  },
  bigKm: {
    fontSize: 32,
    fontWeight: '700',
    color: '#004D40',
  },
  kmLabel: {
    fontSize: 12,
    color: '#74777F',
  },
  statsColumn: {
    alignItems: 'flex-end',
  },
  totalKm: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
    marginBottom: 8,
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
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
  miniLabel: {
    fontSize: 12,
    color: '#74777F',
    marginTop: 8,
    marginBottom: 4,
  },
  miniValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeLabel: {
    fontSize: 11,
    color: '#74777F',
    marginTop: 4,
    marginBottom: 2,
  },
  badgeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  fundCard: {
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
  fundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  fundTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  fundProgress: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  fundAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#004D40',
  },
  fundTarget: {
    fontSize: 14,
    color: '#74777F',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  fundSubtext: {
    fontSize: 12,
    color: '#74777F',
  },
  logCard: {
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
  logTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 16,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7F8',
  },
  logItem: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1C1E',
  },
  logDate: {
    fontSize: 12,
    color: '#74777F',
  },
  logPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BA1A1A',
  },
  assetCard: {
    backgroundColor: '#004D40',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  assetScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  assetScoreValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#10B981',
  },
  assetScoreLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  assetInsight: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});

export default VehicleScreen;