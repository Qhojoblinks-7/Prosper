import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  ArrowLeft,
  Bell,
  TrendingUp,
  Car,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
} from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const NotificationsScreen = () => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);
  const notifications = useFinanceStore((state) => state.notifications);
  const unreadCount = useFinanceStore((state) => state.unreadCount);
  const markNotificationRead = useFinanceStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useFinanceStore((state) => state.markAllNotificationsRead);
  const clearNotifications = useFinanceStore((state) => state.clearNotifications);
  const setSynced = useFinanceStore((state) => state.setSynced);

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  const handleBellPress = (notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    if (notification.type === 'sync') {
      setSynced(true);
      setCurrentScreen('SyncSettings');
    }
  };

  const handleSyncNow = () => {
    setSynced(false);
    setTimeout(() => {
      setSynced(true);
    }, 2000);
    setCurrentScreen('Home');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="#10B981" />;
      case 'warning':
        return <AlertCircle size={20} color="#F59E0B" />;
      case 'sync':
        return <Bell size={20} color="#004D40" />;
      case 'vehicle':
        return <Car size={20} color="#004D40" />;
      case 'vision':
        return <Target size={20} color="#004D40" />;
      case 'target':
        return <TrendingUp size={20} color="#10B981" />;
      default:
        return <Info size={20} color="#74777F" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return '#D1FAE5';
      case 'warning':
        return '#FEF3C7';
      case 'sync':
        return '#E0F2F1';
      case 'vehicle':
        return '#E0F2F1';
      case 'vision':
        return '#E0F2F1';
      case 'target':
        return '#D1FAE5';
      default:
        return '#F5F7F8';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearNotifications}
            disabled={notifications.length === 0}
          >
            <Trash2 size={18} color={notifications.length === 0 ? '#C4C4C4' : '#BA1A1A'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllCard} onPress={markAllNotificationsRead}>
            <CheckCircle size={18} color="#004D40" />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Bell size={48} color="#C4C4C4" />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              You'll receive updates about your finances, sync status, and important reminders here.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadCard,
                ]}
                onPress={() => handleBellPress(notification)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getTypeColor(notification.type) },
                  ]}
                >
                  {getIcon(notification.type)}
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text
                      style={[
                        styles.notificationTitle,
                        !notification.read && styles.unreadTitle,
                      ]}
                    >
                      {notification.title}
                    </Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationBody}>{notification.body}</Text>
                  <Text style={styles.notificationTime}>
                    {formatTime(notification.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.syncPrompt}>
          <View style={styles.syncHeader}>
            <Bell size={20} color="#004D40" />
            <Text style={styles.syncTitle}>Sync Reminder</Text>
          </View>
          <Text style={styles.syncText}>
            Keep your financial data backed up. Sync now to ensure all your progress is safely stored in the cloud.
          </Text>
          <TouchableOpacity style={styles.syncButton} onPress={handleSyncNow}>
            <Text style={styles.syncButtonText}>Sync Now</Text>
          </TouchableOpacity>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    backgroundColor: '#BA1A1A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearButton: {
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  markAllCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004D40',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
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
  notificationsList: {
    gap: 12,
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#004D40',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  unreadTitle: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#004D40',
  },
  notificationBody: {
    fontSize: 13,
    color: '#74777F',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 11,
    color: '#C4C4C4',
  },
  syncPrompt: {
    backgroundColor: '#E0F2F1',
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004D40',
  },
  syncText: {
    fontSize: 13,
    color: '#74777F',
    lineHeight: 18,
    marginBottom: 16,
  },
  syncButton: {
    backgroundColor: '#004D40',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default NotificationsScreen;