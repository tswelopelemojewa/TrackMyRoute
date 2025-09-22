
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { useSessionStorage } from '../hooks/useSessionStorage';
import TrackingButton from '../components/TrackingButton';
import SessionStats from '../components/SessionStats';
import MapPlaceholder from '../components/MapPlaceholder';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function TrackingScreen() {
  console.log('Rendering TrackingScreen');
  
  const {
    isTracking,
    currentLocation,
    currentSession,
    hasPermission,
    startTracking,
    stopTracking,
    requestLocationPermission,
  } = useLocationTracking();

  const { saveSession } = useSessionStorage();
  const [showCompletedSession, setShowCompletedSession] = useState(false);
  const [completedSession, setCompletedSession] = useState(null);

  useEffect(() => {
    if (hasPermission === false) {
      Alert.alert(
        'Location Permission Required',
        'This app needs location permission to track your movement.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestLocationPermission },
        ]
      );
    }
  }, [hasPermission]);

  const handleStartTracking = async () => {
    console.log('Starting tracking session');
    setShowCompletedSession(false);
    setCompletedSession(null);
    await startTracking();
  };

  const handleStopTracking = async () => {
    console.log('Stopping tracking session');
    const session = stopTracking();
    if (session && session.path.length > 0) {
      await saveSession(session);
      setCompletedSession(session);
      setShowCompletedSession(true);
    }
  };

  const handleNewSession = () => {
    setShowCompletedSession(false);
    setCompletedSession(null);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.text}>Requesting location permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Icon name="location-off" size={64} color={colors.accent} />
          <Text style={commonStyles.title}>Location Permission Required</Text>
          <Text style={commonStyles.text}>
            Please grant location permission to use GPS tracking.
          </Text>
          <Button
            text="Grant Permission"
            onPress={requestLocationPermission}
            style={styles.permissionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Link href="/" asChild>
            <Button
              text="← Back"
              onPress={() => console.log('Navigate back')}
              style={styles.backButton}
              textStyle={styles.backButtonText}
            />
          </Link>
          <Text style={commonStyles.title}>GPS Tracking</Text>
        </View>

        <MapPlaceholder
          currentLocation={currentLocation}
          path={currentSession?.path || []}
          showCurrentLocation={isTracking}
        />

        <View style={styles.controlsContainer}>
          <TrackingButton
            isTracking={isTracking}
            onPress={isTracking ? handleStopTracking : handleStartTracking}
            disabled={hasPermission === false}
          />
        </View>

        {(isTracking && currentSession) && (
          <SessionStats session={currentSession} isLive={true} />
        )}

        {(showCompletedSession && completedSession) && (
          <View style={styles.completedSessionContainer}>
            <SessionStats session={completedSession} />
            <View style={styles.sessionActions}>
              <Button
                text="Start New Session"
                onPress={handleNewSession}
                style={styles.newSessionButton}
              />
              <Link href="/history" asChild>
                <Button
                  text="View All Sessions"
                  onPress={() => console.log('Navigate to history')}
                  style={styles.historyButton}
                  textStyle={styles.historyButtonText}
                />
              </Link>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
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
  controlsContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  completedSessionContainer: {
    marginBottom: 20,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    gap: 12,
  },
  newSessionButton: {
    backgroundColor: colors.primary,
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  historyButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  historyButtonText: {
    color: colors.accent,
  },
});
