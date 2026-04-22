import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Lightbulb, Anchor, Wallet, Zap, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useFinanceStore } from '../../store/useFinanceStore';

const tips = [
  {
    title: "Focus on the Input",
    body: "You cannot control the traffic or the number of riders, but you can control your fuel consumption and your temper.",
    category: "Stoic Mindset",
    icon: Anchor,
    color: "#004D40"
  },
  {
    title: "The 10% Rule",
    body: "Pay your future self first. Move 10% of every digital fare immediately to your Savings Vault.",
    category: "Wealth Building",
    icon: Wallet,
    color: "#10B981"
  },
  {
    title: "Idle is Waste",
    body: "Turning off your engine during wait times longer than 2 minutes saves an average of ₵15 per day.",
    category: "Tactical",
    icon: Zap,
    color: "#F59E0B"
  },
  {
    title: "Track Every Cedis",
    body: "What gets measured gets managed. Record every expense immediately after each trip.",
    category: "Tactical",
    icon: Lightbulb,
    color: "#F59E0B"
  },
  {
    title: "Amor Fati",
    body: "If a road is closed or a passenger cancels, do not waste energy on frustration. Use that time to review your logs.",
    category: "Stoic Mindset",
    icon: Anchor,
    color: "#004D40"
  },
  {
    title: "The Emergency Fund",
    body: "Aim for ₵2,000 in your maintenance vault. This covers 80% of unexpected repairs.",
    category: "Wealth Building",
    icon: Wallet,
    color: "#10B981"
  },
];

const FinancialTipsScreen = () => {
  const setCurrentScreen = useFinanceStore((state) => state.setCurrentScreen);

  const handleBack = () => {
    setCurrentScreen('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Financial Tips</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Daily Wisdom</Text>
        
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <TouchableOpacity key={index} style={styles.tipCard}>
              <View style={[styles.iconContainer, { backgroundColor: `${tip.color}15` }]}>
                <Icon size={24} color={tip.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.category, { color: tip.color }]}>{tip.category}</Text>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipBody}>{tip.body}</Text>
              </View>
              <ChevronRight size={18} color="#C4C4C4" />
            </TouchableOpacity>
          );
        })}
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
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1C1E',
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 13,
    color: '#74777F',
    lineHeight: 18,
  },
});

export default FinancialTipsScreen;