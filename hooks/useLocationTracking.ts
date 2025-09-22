
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { LocationPoint, TrackingSession } from '../types/tracking';
import { calculateTotalDistance } from '../utils/locationUtils';

export const useLocationTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [currentSession, setCurrentSession] = useState<TrackingSession | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    requestLocationPermission();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log('Location permission status:', status);
    } catch (error) {
      console.log('Error requesting location permission:', error);
      setHasPermission(false);
    }
  };

  const startTracking = async () => {
    if (!hasPermission) {
      console.log('No location permission');
      return;
    }

    try {
      console.log('Starting location tracking...');
      const newSession: TrackingSession = {
        id: Date.now().toString(),
        startTime: Date.now(),
        distance: 0,
        path: [],
        isActive: true,
      };

      setCurrentSession(newSession);
      setIsTracking(true);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          const newPoint: LocationPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
          };

          setCurrentLocation(newPoint);
          
          setCurrentSession(prevSession => {
            if (!prevSession) return null;
            
            const updatedPath = [...prevSession.path, newPoint];
            const distance = calculateTotalDistance(updatedPath);
            
            return {
              ...prevSession,
              path: updatedPath,
              distance,
            };
          });
        }
      );
    } catch (error) {
      console.log('Error starting location tracking:', error);
    }
  };

  const stopTracking = () => {
    console.log('Stopping location tracking...');
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    setIsTracking(false);
    
    if (currentSession) {
      const endTime = Date.now();
      const finalSession: TrackingSession = {
        ...currentSession,
        endTime,
        duration: endTime - currentSession.startTime,
        isActive: false,
      };
      
      setCurrentSession(finalSession);
      return finalSession;
    }
    
    return null;
  };

  return {
    isTracking,
    currentLocation,
    currentSession,
    hasPermission,
    startTracking,
    stopTracking,
    requestLocationPermission,
  };
};
