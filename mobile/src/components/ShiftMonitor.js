import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity, ArrowUpRight, Clock, TrendingUp, User, Gauge } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

const ProgressCircle = ({ percent, radius, strokeWidth, color, children }) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  
  return (
    <View style={{ width: radius * 2, height: radius * 2, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          stroke="#00332C"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${radius}, ${radius}`}
        />
      </Svg>
      <View style={styles.progressInner}>
        {children}
      </View>
    </View>
  );
};

const ShiftMonitor = ({ 
  isActive = false, 
  shiftDuration = '0h 0m', 
  tripsCount = 0, 
  profitPerHour = 0,
  fuelEfficiency = 0,
  onExpandPress 
}) => {
  const isInProfitZone = fuelEfficiency >= 70;
  const progressColor = isInProfitZone ? '#00E676' : '#FFB74D';
  
  const formatProfit = (value) => {
    return `₵${value.toFixed(2)}`;
  };

  return (
    <View style={styles.monitoringCard}>
      <View style={styles.cardTop}>
        <View style={styles.titleRow}>
          <View style={styles.iconBox}>
            <Activity size={20} color="#FFF" />
          </View>
          <Text style={styles.cardTitle}>Active Shift</Text>
        </View>
        <TouchableOpacity style={styles.expandBtn} onPress={onExpandPress}>
          <ArrowUpRight size={18} color="#004D40" />
        </TouchableOpacity>
      </View>

      <View style={styles.liveBadge}>
        <View style={[styles.greenDot, !isActive && styles.inactiveDot]} />
        <Text style={styles.liveText}>
          {isActive ? 'Tracking Live' : 'Not Active'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.leftStats}>
          <View style={styles.statItem}>
            <Clock size={16} color="#FFF" opacity={0.7} />
            <Text style={styles.statValue}>{shiftDuration}</Text>
          </View>
          <View style={styles.statItem}>
            <Gauge size={16} color="#FFF" opacity={0.7} />
            <Text style={styles.statValue}>{tripsCount} trips</Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={16} color="#FFF" opacity={0.7} />
            <Text style={styles.statValue}>{formatProfit(profitPerHour)} / hr</Text>
          </View>
        </View>

        <View style={styles.progressCircle}>
          <ProgressCircle 
            percent={fuelEfficiency} 
            radius={50} 
            strokeWidth={10} 
            color={progressColor}
          >
            <Text style={styles.progressText}>{fuelEfficiency}%</Text>
          </ProgressCircle>
          <Text style={styles.progressLabel}>Efficiency</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  monitoringCard: {
    backgroundColor: '#004D40',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#006A60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
  },
  inactiveDot: {
    backgroundColor: '#74777F',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#00E676',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftStats: {
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressCircle: {
    alignItems: 'center',
  },
  progressInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 4,
  },
});

export default ShiftMonitor;