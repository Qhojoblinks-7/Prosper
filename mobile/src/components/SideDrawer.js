import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import {
  X,
  Target,
  Car,
  BarChart3,
  Lightbulb,
  PiggyBank,
  Shield,
  RefreshCw,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.82;

const menuItems = [
  {
    group: 'Business',
    items: [
      { label: 'Annual Vision', icon: Target, color: '#004D40', screen: 'AnnualVision' },
      { label: 'Vehicle Management', icon: Car, color: '#004D40', screen: 'VehicleManagement' },
      { label: 'Insight Reports', icon: BarChart3, color: '#004D40', screen: 'InsightReports' },
    ],
  },
  {
    group: 'Financial',
    items: [
      { label: 'Financial Tips', icon: Lightbulb, color: '#F59E0B', screen: 'FinancialTips' },
      { label: 'Set Targets', icon: TrendingUp, color: '#10B981', screen: 'SetTargets' },
      { label: 'Savings Vaults', icon: PiggyBank, color: '#004D40', screen: 'SavingsVaults' },
      { label: 'Safety Net', icon: Shield, color: '#10B981', screen: 'SafetyNet' },
    ],
  },
  {
    group: 'Settings',
    items: [
      { label: 'Sync Now', icon: RefreshCw, color: '#74777F', screen: 'SyncSettings' },
      { label: 'App Settings', icon: Settings, color: '#74777F', screen: 'AppSettings' },
    ],
  },
];

const SideDrawer = ({ visible, onClose, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const drawerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
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

  const handleOverlayPress = () => {
    onClose();
  };

  const handleMenuItemPress = (screen) => {
    onClose();
    if (navigation && navigation.navigate) {
      setTimeout(() => {
        navigation.navigate(screen);
      }, 300);
    }
  };

  const handleLogout = () => {
    onClose();
  };

  if (!visible && slideAnim._value === -DRAWER_WIDTH) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessibilityLabel="Navigation menu"
      accessibilityStates={visible ? ['selected'] : []}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={handleOverlayPress}
        activeOpacity={1}
        accessibilityLabel="Close menu"
        accessibilityHint="Double tap to close the navigation menu"
      >
        <Animated.View style={[styles.overlayBg, { opacity: fadeAnim }]} />
      </TouchableOpacity>

      <Animated.View
        ref={drawerRef}
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }], width: DRAWER_WIDTH },
        ]}
      >
        <View style={styles.drawerContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close menu"
            accessibilityHint="Closes the navigation menu"
          >
            <X size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>

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

          <ScrollView
            style={styles.menuScroll}
            contentContainerStyle={styles.menuScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.drawerContentInner}>
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
                            itemIndex < group.items.length - 1 && styles.menuItemBorder,
                          ]}
                          onPress={() => handleMenuItemPress(item.screen)}
                          accessibilityLabel={item.label}
                        >
                          <View
                            style={[
                              styles.iconBox,
                              { backgroundColor: `${item.color}15` },
                            ]}
                          >
                            <IconComponent
                              size={18}
                              color={item.color}
                              strokeWidth={2.5}
                            />
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
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              accessibilityLabel="Log out"
            >
              <LogOut size={18} color="#BA1A1A" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
            <Text style={styles.version}>Prosper v1.0.4</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#004D40',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    backgroundColor: '#004D40',
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
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
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  menuScroll: {
    flex: 1,
    backgroundColor: '#F5F7F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
  },
  menuScrollContent: {
    paddingTop: 8,
  },
  drawerContentInner: {
    paddingHorizontal: 16,
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
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F5F7F8',
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

export default SideDrawer;