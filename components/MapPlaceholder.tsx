
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { LocationPoint } from '../types/tracking';
import Icon from './Icon';

interface MapPlaceholderProps {
  currentLocation?: LocationPoint | null;
  path?: LocationPoint[];
  showCurrentLocation?: boolean;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  currentLocation, 
  path = [], 
  showCurrentLocation = false 
}) => {
  return (
    <View style={styles.container}>
      <Icon name="map" size={64} color={colors.accent} />
      <Text style={styles.title}>Map View</Text>
      <Text style={styles.subtitle}>
        react-native-maps is not supported in Natively right now
      </Text>
      
      {currentLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Current Location:
          </Text>
          <Text style={styles.coordinates}>
            {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}
      
      {path.length > 0 && (
        <View style={styles.pathInfo}>
          <Text style={styles.pathText}>
            Tracking Path: {path.length} points recorded
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    margin: 16,
    padding: 20,
    minHeight: 300,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  title: {
    ...commonStyles.title,
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    ...commonStyles.text,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
  },
  locationInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  locationText: {
    ...commonStyles.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  coordinates: {
    ...commonStyles.text,
    fontSize: 14,
    fontFamily: 'monospace',
    color: colors.accent,
  },
  pathInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  pathText: {
    ...commonStyles.text,
    fontSize: 14,
    color: colors.accent,
  },
});

export default MapPlaceholder;
