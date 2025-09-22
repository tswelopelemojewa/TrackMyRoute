
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface TrackingButtonProps {
  isTracking: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const TrackingButton: React.FC<TrackingButtonProps> = ({ isTracking, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isTracking ? styles.stopButton : styles.startButton,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon
        name={isTracking ? 'stop' : 'play'}
        size={32}
        color="white"
        style={styles.icon}
      />
      <Text style={styles.buttonText}>
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    minWidth: 200,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: colors.grey,
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
});

export default TrackingButton;
