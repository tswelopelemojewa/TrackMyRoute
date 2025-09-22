
import React, { useEffect, useRef, useState } from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { colors } from '../styles/commonStyles';

interface SimpleBottomSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const SNAP_POINTS = [0, 0.5, 0.9];

const SimpleBottomSheet: React.FC<SimpleBottomSheetProps> = ({ children, isVisible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      snapToPoint(0.5);
    } else {
      snapToPoint(0);
      setTimeout(() => setModalVisible(false), 300);
    }
  }, [isVisible]);

  const snapToPoint = (point: number) => {
    const screenHeight = Dimensions.get('window').height;
    const targetY = screenHeight * (1 - point);
    
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: targetY,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(backdropOpacity, {
        toValue: point > 0 ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBackdropPress = () => {
    if (onClose) {
      onClose();
    }
  };

  const getClosestSnapPoint = (currentY: number, velocityY: number): number => {
    const screenHeight = Dimensions.get('window').height;
    const currentPoint = 1 - currentY / screenHeight;
    
    if (velocityY > 500) return 0;
    if (velocityY < -500) return 0.9;
    
    let closest = SNAP_POINTS[0];
    let minDistance = Math.abs(currentPoint - closest);
    
    for (const point of SNAP_POINTS) {
      const distance = Math.abs(currentPoint - point);
      if (distance < minDistance) {
        minDistance = distance;
        closest = point;
      }
    }
    
    return closest;
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      const screenHeight = Dimensions.get('window').height;
      const currentY = screenHeight * 0.5 + translationY;
      
      const targetPoint = getClosestSnapPoint(currentY, velocityY);
      
      if (targetPoint === 0 && onClose) {
        onClose();
      } else {
        snapToPoint(targetPoint);
      }
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={handleBackdropPress}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity }
            ]}
          />
        </TouchableWithoutFeedback>
        
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY }] }
            ]}
          >
            <View style={styles.handle} />
            <View style={styles.content}>
              {children}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '90%',
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.grey,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default SimpleBottomSheet;
