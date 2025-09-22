
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { TrackingSession } from '../types/tracking';
import { formatDistance, formatDuration, formatTime } from '../utils/locationUtils';

interface SessionStatsProps {
  session: TrackingSession | null;
  isLive?: boolean;
}

const SessionStats: React.FC<SessionStatsProps> = ({ session, isLive = false }) => {
  if (!session) return null;

  const duration = session.duration || (Date.now() - session.startTime);
  const averageSpeed = duration > 0 ? (session.distance / (duration / 1000)) : 0;

  return (
    <View style={styles.container}>
      <Text style={[commonStyles.title, styles.title]}>
        {isLive ? 'Current Session' : 'Session Stats'}
      </Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDistance(session.distance)}</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDuration(duration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(session.startTime)}</Text>
          <Text style={styles.statLabel}>Start Time</Text>
        </View>
        
        {session.endTime && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(session.endTime)}</Text>
            <Text style={styles.statLabel}>End Time</Text>
          </View>
        )}
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{averageSpeed.toFixed(1)} m/s</Text>
          <Text style={styles.statLabel}>Avg Speed</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{session.path.length}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
});

export default SessionStats;
