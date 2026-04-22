import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFinanceStore = create(
  persist(
    (set) => ({
      cashOnHand: 0,
      momoBalance: 0,
      transactions: [],
      
      addTransaction: (tx) => set((state) => ({
        transactions: [{ ...tx, synced: false, createdAt: new Date().toISOString() }, ...state.transactions],
        cashOnHand: tx.method === 'CASH' 
          ? state.cashOnHand + (tx.is_income ? Number(tx.amount) : -Number(tx.amount)) 
          : state.cashOnHand,
        momoBalance: tx.method === 'MOMO' 
          ? state.momoBalance + (tx.is_income ? Number(tx.amount) : -Number(tx.amount)) 
          : state.momoBalance,
      })),
      
      markAllSynced: () => set((state) => ({
        transactions: state.transactions.map(t => ({ ...t, synced: true })),
      })),
      
      updateBalances: (cash, momo) => set({
        cashOnHand: cash,
        momoBalance: momo,
      }),
      
      clearTransactions: () => set({
        transactions: [],
        cashOnHand: 0,
        momoBalance: 0,
      }),
      
      isSynced: true,
      setSynced: (status) => set({ isSynced: status }),

      isShiftActive: false,
      startShift: () => set({ isShiftActive: true, shiftStartTime: new Date().toISOString() }),
      endShift: () => set({ isShiftActive: false, shiftStartTime: null }),

      driverName: 'Driver',
      setDriverName: (name) => set({ driverName: name }),

      safetyNet: 200,
      safetyNetTarget: 500,
      setSafetyNet: (amount) => set({ safetyNet: amount }),
      
      topExpense: null,
      topExpenseAmount: 0,
      setTopExpense: (category, amount) => set({ topExpense: category, topExpenseAmount: amount }),

      isDrawerOpen: false,
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      currentScreen: 'Home',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),

      annualVisionData: null,
      setAnnualVisionData: (data) => set({ annualVisionData: data }),

      dailyGoal: 400,
      allocations: [
        { id: 1, label: 'Operating Costs', percent: 50 },
        { id: 2, label: 'Business Growth', percent: 20 },
        { id: 3, label: 'Safety Net', percent: 10 },
        { id: 4, label: 'Personal/Home', percent: 20 },
      ],
      milestones: [],
      setTargetsSaved: (data) => set(data),

      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            id: Date.now().toString(),
            title: notification.title,
            body: notification.body,
            type: notification.type || 'info',
            timestamp: new Date().toISOString(),
            read: false,
          },
          ...state.notifications,
        ].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      alerts: [],
      addAlert: (alert) => set((state) => ({
        alerts: [
          {
            id: Date.now().toString(),
            title: alert.title,
            message: alert.message,
            category: alert.category || 'action',
            priority: alert.priority || 'normal',
            action: alert.action || null,
            timestamp: new Date().toISOString(),
            dismissed: false,
          },
          ...state.alerts,
        ].slice(0, 30),
      })),
      dismissAlert: (id) => set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === id ? { ...a, dismissed: true } : a
        ),
      })),
      clearAlerts: () => set({ alerts: [] }),
      
      maintenanceWarning: null,
      setMaintenanceWarning: (data) => set({ maintenanceWarning: data }),
      
      dailyGoalProgress: 0,
      setDailyGoalProgress: (progress) => set({ dailyGoalProgress: progress }),
      
      shiftStartTime: null,
      setShiftStartTime: (time) => set({ shiftStartTime: time }),
    }),
    {
      name: 'prosper-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);