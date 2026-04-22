import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { 
  Moon, 
  Bell, 
  Globe, 
  Database, 
  Trash2, 
  ChevronRight, 
  ArrowLeft, 
  Sun,
  Download,
  Info,
} from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const AppSettingsScreen = () => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  const SettingItem = ({ icon: Icon, label, hint, value, onToggle, type, color = '#004D40' }) => (
    <TouchableOpacity style={styles.settingItem} disabled={type === 'switch'}>
      <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {hint && <Text style={styles.settingHint}>{hint}</Text>}
      </View>
      {type === 'switch' ? (
        <Switch 
          value={value} 
          onValueChange={onToggle} 
          trackColor={{ false: '#E5E7EB', true: '#10B981' }}
          thumbColor='#FFFFFF'
        />
      ) : (
        <ChevronRight size={18} color='#C4C4C4' />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color='#1A1C1E' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.groupCard}>
          <SettingItem icon={Moon} label='Dark Mode' hint='Save battery at night' value={isDarkMode} onToggle={setIsDarkMode} type='switch' />
          <SettingItem icon={Sun} label='High Contrast' hint='Sharper text in bright light' value={false} onToggle={() => {}} type='switch' color='#F59E0B' />
        </View>

        <Text style={styles.sectionTitle}>Localization</Text>
        <View style={styles.groupCard}>
          <SettingItem icon={Globe} label='Currency' hint='Ghana Cedi (GHS)' type='link' />
          <SettingItem icon={Globe} label='Language' hint='English' type='link' />
          <SettingItem icon={Globe} label='Timezone' hint='GMT (Accra)' type='link' />
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.groupCard}>
          <SettingItem icon={Bell} label='All Notifications' hint='Master toggle' value={notifications} onToggle={setNotifications} type='switch' />
          {notifications && (
            <>
              <SettingItem icon={Bell} label='Shift Reminders' hint='Start shift log at 6:00 AM' value={shiftReminders} onToggle={setShiftReminders} type='switch' color='#F59E0B' />
              <SettingItem icon={Bell} label='Daily Summary' hint='View profit at 8:00 PM' value={dailySummary} onToggle={setDailySummary} type='switch' color='#F59E0B' />
              <SettingItem icon={Bell} label='Maintenance Alerts' hint='Service milestone reminders' value={maintenanceAlerts} onToggle={setMaintenanceAlerts} type='switch' color='#F59E0B' />
            </>
          )}
        </View>

        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.groupCard}>
          <SettingItem icon={Download} label='Export All Data' hint='Download as CSV file' type='link' color='#10B981' />
          <SettingItem icon={Database} label='Cloud Backup' hint='Last backup: April 19, 2026' type='link' />
          <SettingItem icon={Trash2} label='Clear Local Cache' hint='Free up 124 KB' type='link' color='#BA1A1A' />
        </View>

        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <Info size={20} color='#004D40' />
            <Text style={styles.aboutTitle}>About Prosper</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.4</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>2026.04.19</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.legalLink}>
          <Text style={styles.legalText}>Privacy Policy & Terms of Service</Text>
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#74777F',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 8,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7F8',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  settingHint: {
    fontSize: 12,
    color: '#74777F',
    marginTop: 2,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7F8',
  },
  aboutLabel: {
    fontSize: 14,
    color: '#74777F',
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  legalLink: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
  },
  legalText: {
    fontSize: 12,
    color: '#C4C4C4',
    textDecorationLine: 'underline',
  },
});

export default AppSettingsScreen;