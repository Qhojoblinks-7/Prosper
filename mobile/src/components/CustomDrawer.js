import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { 
  Target, Car, BarChart3, Lightbulb, 
  PiggyBank, Shield, RefreshCw, Settings, 
  LogOut, ChevronRight, TrendingUp 
} from 'lucide-react-native';

const CustomDrawer = (props) => {
  const { navigation } = props;

  const menuItems = [
    { 
      group: 'Business',
      items: [
        { label: 'Annual Vision', icon: Target, color: '#004D40', screen: 'AnnualVision' },
        { label: 'Vehicle Management', icon: Car, color: '#004D40', screen: 'VehicleManagement' },
        { label: 'Insight Reports', icon: BarChart3, color: '#004D40', screen: 'InsightReports' },
      ]
    },
    { 
      group: 'Financial',
      items: [
        { label: 'Financial Tips', icon: Lightbulb, color: '#F59E0B', screen: 'FinancialTips' },
        { label: 'Set Targets', icon: TrendingUp, color: '#10B981', screen: 'SetTargets' },
        { label: 'Savings Vaults', icon: PiggyBank, color: '#004D40', screen: 'SavingsVaults' },
        { label: 'Safety Net', icon: Shield, color: '#10B981', screen: 'SafetyNet' },
      ]
    },
    { 
      group: 'Settings',
      items: [
        { label: 'Sync Now', icon: RefreshCw, color: '#74777F', screen: 'SyncSettings' },
        { label: 'App Settings', icon: Settings, color: '#74777F', screen: 'AppSettings' },
      ]
    },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>JM</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Growth Phase</Text>
            </View>
          </View>
          <Text style={styles.userName}>James Mensah</Text>
          <Text style={styles.userRole}>Entrepreneur</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₵1,240</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₵500</Text>
              <Text style={styles.statLabel}>Goal</Text>
            </View>
          </View>
        </View>

        <View style={styles.drawerContent}>
          {menuItems.map((group, groupIndex) => (
            <View key={groupIndex} style={styles.menuGroup}>
              <Text style={styles.groupLabel}>{group.group}</Text>
              <View style={styles.groupCard}>
                {group.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <TouchableOpacity
                      key={itemIndex}
                      style={[
                        styles.menuItem,
                        itemIndex < group.items.length - 1 && styles.menuItemBorder
                      ]}
                      onPress={() => navigation.navigate(item.screen)}
                    >
                      <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                        <IconComponent size={18} color={item.color} strokeWidth={2.5} />
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <ChevronRight size={16} color="#C4C4C4" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={18} color="#BA1A1A" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Prosper v1.0.4</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileHeader: {
    backgroundColor: '#004D40',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#006A60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 20,
  },
  drawerContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  menuGroup: {
    marginBottom: 20,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#74777F',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7F8',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1C1E',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F7F8',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#BA1A1A',
  },
  version: {
    fontSize: 11,
    color: '#C4C4C4',
  },
});

export default CustomDrawer;