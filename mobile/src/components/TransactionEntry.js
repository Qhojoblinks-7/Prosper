import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Car, Wrench, Utensils, DollarSign, Smartphone } from 'lucide-react-native';

const CATEGORIES = {
  Income: [
    { id: 'fare', label: 'Fare', IconComponent: Car, color: '#10B981' },
  ],
  Expense: [
    { id: 'fuel', label: 'Fuel', IconComponent: DollarSign, color: '#FBBF24' },
    { id: 'repair', label: 'Repair', IconComponent: Wrench, color: '#74777F' },
    { id: 'food', label: 'Food/Personal', IconComponent: Utensils, color: '#F59E0B' },
  ],
};

const IMPACT_NOTES = {
  fare: 'Great! This adds to your earnings.',
  fuel: 'This will reduce your net profit.',
  repair: 'Essential but reduces today\'s earnings.',
  food: 'Remember, personal spending isn\'t tax-deductible.',
};

const TransactionEntry = ({ visible, onClose, onSave }) => {
  const [type, setType] = useState('Income');
  const [wallet, setWallet] = useState('CASH');
  const [category, setCategory] = useState('fare');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    onSave({
      amount: parseFloat(amount),
      type: type,
      method: wallet,
      category: category,
      createdAt: new Date().toISOString(),
    });
    
    setAmount('');
    setCategory('fare');
    onClose();
  };

  const getImpactNote = () => {
    if (type === 'Income') return IMPACT_NOTES['fare'];
    return IMPACT_NOTES[category] || '';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.title}>New Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color="#1A1C1E" />
            </TouchableOpacity>
          </View>

          <View style={styles.segmentContainer}>
            <TouchableOpacity 
              style={[styles.segment, type === 'Income' && styles.activeSegment]}
              onPress={() => {
                setType('Income');
                setCategory('fare');
              }}
            >
              <Text style={[styles.segmentText, type === 'Income' && styles.activeText]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.segment, type === 'Expense' && styles.activeSegment]}
              onPress={() => {
                setType('Expense');
                setCategory('fuel');
              }}
            >
              <Text style={[styles.segmentText, type === 'Expense' && styles.activeText]}>Expense</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amountWrapper}>
            <Text style={styles.currencySymbol}>₵</Text>
            <TextInput 
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#C4C4C4"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>

          <View style={styles.walletSection}>
            <Text style={styles.sectionLabel}>Wallet</Text>
            <View style={styles.walletRow}>
              <TouchableOpacity 
                style={[styles.walletOption, wallet === 'CASH' && styles.walletActive]}
                onPress={() => setWallet('CASH')}
              >
                <View style={[styles.walletIconBox, wallet === 'CASH' && styles.walletIconActive]}>
                  <DollarSign size={18} color={wallet === 'CASH' ? '#FFF' : '#004D40'} strokeWidth={2.5} />
                </View>
                <Text style={[styles.walletText, wallet === 'CASH' && styles.walletTextActive]}>Cash</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.walletOption, wallet === 'MOMO' && styles.walletActive]}
                onPress={() => setWallet('MOMO')}
              >
                <View style={[styles.walletIconBox, wallet === 'MOMO' && styles.walletIconActive]}>
                  <Smartphone size={18} color={wallet === 'MOMO' ? '#FFF' : '#004D40'} strokeWidth={2.5} />
                </View>
                <Text style={[styles.walletText, wallet === 'MOMO' && styles.walletTextActive]}>MoMo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES[type].map((cat) => {
                const IconComp = cat.IconComponent;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      category === cat.id && { backgroundColor: cat.color, borderColor: cat.color }
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <IconComp size={22} color={category === cat.id ? '#FFF' : cat.color} strokeWidth={2.5} />
                    <Text style={[
                      styles.categoryLabel,
                      category === cat.id && styles.categoryLabelActive
                    ]}>{cat.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {amount && (
            <View style={styles.impactNote}>
              <Text style={styles.impactText}>{getImpactNote()}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.saveButton, (!amount || parseFloat(amount) <= 0) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <Text style={styles.saveText}>Log Transaction</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  closeBtn: {
    padding: 4,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F7F8',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: '#004D40',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#74777F',
  },
  activeText: {
    color: '#FFFFFF',
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: '700',
    color: '#004D40',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1A1C1E',
    minWidth: 120,
    textAlign: 'center',
  },
  walletSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#74777F',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  walletRow: {
    flexDirection: 'row',
    gap: 12,
  },
  walletOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F7F8',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  walletActive: {
    borderColor: '#004D40',
    backgroundColor: '#E0F2F1',
  },
  walletIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletIconActive: {
    backgroundColor: '#004D40',
  },
  walletText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#74777F',
  },
  walletTextActive: {
    color: '#004D40',
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F7F8',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#74777F',
    marginBottom: 2,
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
  impactNote: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  impactText: {
    fontSize: 12,
    color: '#004D40',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#004D40',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#C4C4C4',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TransactionEntry;