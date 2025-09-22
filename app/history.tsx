
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { TrackingSession } from '../types/tracking';
import { formatDistance, formatDuration, formatTime } from '../utils/locationUtils';
import Button from '../components/Button';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import SessionStats from '../components/SessionStats';

export default function HistoryScreen() {
  console.log('Rendering HistoryScreen');
  
  const { sessions, isLoading, clearAllSessions, deleteSession } = useSessionStorage();
  const [selectedSession, setSelectedSession] = useState<TrackingSession | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all tracking sessions? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllSessions();
            console.log('All sessions cleared');
          },
        },
      ]
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSession(sessionId);
            console.log('Session deleted:', sessionId);
          },
        },
      ]
    );
  };

  const handleSessionPress = (session: TrackingSession) => {
    setSelectedSession(session);
    setIsBottomSheetVisible(true);
  };

  const renderSessionItem = (session: TrackingSession) => (
    <TouchableOpacity
      key={session.id}
      style={styles.sessionItem}
      onPress={() => handleSessionPress(session)}
    >
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionDate}>
          {new Date(session.startTime).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteSession(session.id)}
          style={styles.deleteButton}
        >
          <Icon name="trash" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.sessionDetails}>
        <View style={styles.sessionStat}>
          <Icon name="location" size={16} color={colors.accent} />
          <Text style={styles.sessionStatText}>{formatDistance(session.distance)}</Text>
        </View>
        
        <View style={styles.sessionStat}>
          <Icon name="time" size={16} color={colors.accent} />
          <Text style={styles.sessionStatText}>
            {session.duration ? formatDuration(session.duration) : 'In Progress'}
          </Text>
        </View>
        
        <View style={styles.sessionStat}>
          <Icon name="play" size={16} color={colors.accent} />
          <Text style={styles.sessionStatText}>{formatTime(session.startTime)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.text}>Loading sessions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <Button
            text="← Back"
            onPress={() => console.log('Navigate back')}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
        </Link>
        <Text style={commonStyles.title}>Session History</Text>
      </View>

      {sessions.length === 0 ? (
        <View style={commonStyles.content}>
          <Icon name="folder-open" size={64} color={colors.accent} />
          <Text style={commonStyles.title}>No Sessions Yet</Text>
          <Text style={commonStyles.text}>
            Start tracking to see your sessions here
          </Text>
          <Link href="/tracking" asChild>
            <Button
              text="Start Tracking"
              onPress={() => console.log('Navigate to tracking')}
              style={styles.startTrackingButton}
            />
          </Link>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.statsHeader}>
            <Text style={styles.totalSessions}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </Text>
            <Button
              text="Clear All"
              onPress={handleClearHistory}
              style={styles.clearButton}
              textStyle={styles.clearButtonText}
            />
          </View>

          <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
            {sessions.map(renderSessionItem)}
          </ScrollView>
        </View>
      )}

      <SimpleBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
      >
        {selectedSession && (
          <View style={styles.bottomSheetContent}>
            <SessionStats session={selectedSession} />
          </View>
        )}
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  totalSessions: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#F44336',
    fontSize: 14,
  },
  sessionsList: {
    flex: 1,
  },
  sessionItem: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  deleteButton: {
    padding: 4,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionStatText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
  startTrackingButton: {
    backgroundColor: colors.primary,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bottomSheetContent: {
    padding: 0,
  },
});
