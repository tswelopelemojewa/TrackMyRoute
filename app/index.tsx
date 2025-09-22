
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function HomeScreen() {
  console.log('Rendering HomeScreen');

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={commonStyles.content}>
          <Icon name="location" size={80} color={colors.accent} style={styles.mainIcon} />
          
          <Text style={commonStyles.title}>GPS Tracker</Text>
          <Text style={commonStyles.text}>
            Track your movement and view your routes
          </Text>

          <View style={styles.buttonContainer}>
            <Link href="/tracking" asChild>
              <Button
                text="Start Tracking"
                onPress={() => console.log('Navigate to tracking')}
                style={styles.primaryButton}
              />
            </Link>

            <Link href="/history" asChild>
              <Button
                text="View History"
                onPress={() => console.log('Navigate to history')}
                style={styles.secondaryButton}
                textStyle={styles.secondaryButtonText}
              />
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainIcon: {
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: colors.accent,
  },
});
