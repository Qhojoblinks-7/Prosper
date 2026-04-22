import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from './src/components/Header';
import SideDrawer from './src/components/SideDrawer';
import HeroCard from './src/components/HeroCard';
import LiquidityCards from './src/components/LiquidityCards';
import ShiftMonitor from './src/components/ShiftMonitor';
import ExpenseFocus from './src/components/ExpenseFocus';
import SafetyNet from './src/components/SafetyNet';
import WealthTracker from './src/components/WealthTracker';
import WealthOverview from './src/components/WealthOverview';
import MaintenanceTracker from './src/components/MaintenanceTracker';
import TransactionEntry from './src/components/TransactionEntry';
import AnnualVisionScreen from './src/components/AnnualVisionScreen';
import VehicleScreen from './src/components/VehicleScreen';
import FinancialTipsScreen from './src/components/FinancialTipsScreen';
import InsightReportsScreen from './src/components/InsightReportsScreen';
import SetTargetsScreen from './src/components/SetTargetsScreen';
import SavingsVaultsScreen from './src/components/SavingsVaultsScreen';
import SafetyNetScreen from './src/components/SafetyNetScreen';
import SyncSettingsScreen from './src/components/SyncSettingsScreen';
import AppSettingsScreen from './src/components/AppSettingsScreen';
import { useFinanceStore } from './store/useFinanceStore';

const HomeScreen = () => {
  const [showEntry, setShowEntry] = useState(false);
  
  const isDrawerOpen = useFinanceStore((state) => state.isDrawerOpen);
  const toggleDrawer = useFinanceStore((state) => state.toggleDrawer);
  const closeDrawer = useFinanceStore((state) => state.closeDrawer);
  
  const isSynced = useFinanceStore((state) => state.isSynced);
  const isShiftActive = useFinanceStore((state) => state.isShiftActive);
  const driverName = useFinanceStore((state) => state.driverName);
  const startShift = useFinanceStore((state) => state.startShift);
  const cashOnHand = useFinanceStore((state) => state.cashOnHand);
  const momoBalance = useFinanceStore((state) => state.momoBalance);
  const safetyNet = useFinanceStore((state) => state.safetyNet);
  const safetyNetTarget = useFinanceStore((state) => state.safetyNetTarget);
  const topExpense = useFinanceStore((state) => state.topExpense);
  const topExpenseAmount = useFinanceStore((state) => state.topExpenseAmount);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const setTopExpense = useFinanceStore((state) => state.setTopExpense);
  const currentScreen = useFinanceStore((state) => state.currentScreen);
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);

  const handleShiftPress = () => {
    if (!isShiftActive) {
      startShift();
    }
    setShowEntry(true);
  };

  const handleEntryClose = () => {
    setShowEntry(false);
  };

  const handleSaveTransaction = (transaction) => {
    const isIncome = transaction.type === 'Income';
    
    addTransaction({
      ...transaction,
      is_income: isIncome,
      category: transaction.category,
    });

    if (!isIncome && transaction.amount > topExpenseAmount) {
      const categoryLabels = {
        fuel: 'Fuel',
        repair: 'Repair',
        food: 'Food/Personal',
      };
      setTopExpense(categoryLabels[transaction.category] || 'Other', transaction.amount);
    }
  };

  const handleMenuPress = () => {
    toggleDrawer();
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  if (currentScreen === 'AnnualVision') {
    return <AnnualVisionScreen navigation={{ navigate: handleNavigate }} />;
  }

  if (currentScreen === 'VehicleManagement') {
    return <VehicleScreen navigation={{ navigate: handleNavigate }} />;
  }

  if (currentScreen === 'FinancialTips') {
    return <FinancialTipsScreen navigation={{ navigate: handleNavigate }} />;
  }

  if (currentScreen === 'InsightReports') {
    return <InsightReportsScreen navigation={{ navigate: handleNavigate }} />;
  }

  if (currentScreen === 'SetTargets') {
    return <SetTargetsScreen navigation={{ navigate: handleNavigate }} />;
  }

  if (currentScreen === 'SavingsVaults') {
    return <SavingsVaultsScreen navigation={{ navigate: handleNavigate }} />;
  }

  if (currentScreen === 'SafetyNet') {
    return <SafetyNetScreen navigation={{ navigate: handleNavigate }} />;
  }

  if (currentScreen === 'SyncSettings') {
    return <SyncSettingsScreen navigation={{ navigate: handleNavigate }} />;
  }

  if (currentScreen === 'AppSettings') {
    return <AppSettingsScreen navigation={{ navigate: handleNavigate }} />;
  }

  return (
    <View style={styles.container}>
      <Header isSynced={isSynced} onMenuPress={handleMenuPress} />
      <SideDrawer 
        visible={isDrawerOpen} 
        onClose={closeDrawer}
        navigation={{ navigate: handleNavigate }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <HeroCard 
          name={driverName} 
          isShiftActive={isShiftActive} 
          onPress={handleShiftPress}
        />
        <LiquidityCards 
          cashOnHand={cashOnHand} 
          digitalBalance={momoBalance} 
        />
        <ShiftMonitor isActive={isShiftActive} />
        <View style={styles.analyticsColumn}>
          <ExpenseFocus 
            topExpense={topExpense} 
            topExpenseAmount={topExpenseAmount} 
          />
          <SafetyNet 
            savingsAmount={safetyNet} 
            targetAmount={safetyNetTarget} 
          />
        </View>
        <WealthTracker />
        <View style={styles.overviewColumn}>
          <WealthOverview />
          <MaintenanceTracker />
        </View>
      </ScrollView>
      <TransactionEntry 
        visible={showEntry} 
        onClose={handleEntryClose}
        onSave={handleSaveTransaction}
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HomeScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F8',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  analyticsColumn: {
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 16,
  },
  overviewColumn: {
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 16,
  },
});