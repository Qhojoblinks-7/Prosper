import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PlusCircle } from 'lucide-react-native';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getDateString = () => {
  const date = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const QUOTES = [
  "Focus on what you can control: your expenses.",
  "A penny saved is a penny earned.",
  "Track every cedi, master your destiny.",
  "Discipline is the bridge between goals and accomplishment.",
  "Your financial future starts with today's choices.",
];

const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

const HeroCard = ({ name = 'Driver', isShiftActive = false, onPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.greeting}>{getGreeting()}, {name}</Text>
      <Text style={styles.dateText}>{getDateString()}</Text>
      <Text style={styles.quote}>"{getRandomQuote()}"</Text>
      
      <TouchableOpacity 
        style={[styles.button, isShiftActive ? styles.activeBtn : styles.startBtn]}
        onPress={onPress}
      >
        <PlusCircle size={20} color="#FFF" />
        <Text style={styles.buttonText}>
          {isShiftActive ? "Log New Entry" : "Start Daily Shift"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  dateText: {
    fontSize: 14,
    color: '#74777F',
    marginTop: 4,
  },
  quote: {
    fontSize: 13,
    color: '#004D40',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  startBtn: {
    backgroundColor: '#004D40',
  },
  activeBtn: {
    backgroundColor: '#006A60',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HeroCard;