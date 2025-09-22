
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackingSession } from '../types/tracking';

const SESSIONS_STORAGE_KEY = 'tracking_sessions';

export const useSessionStorage = () => {
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      console.log('Loading sessions from storage...');
      const storedSessions = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        setSessions(parsedSessions);
        console.log('Loaded sessions:', parsedSessions.length);
      }
    } catch (error) {
      console.log('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = async (session: TrackingSession) => {
    try {
      console.log('Saving session:', session.id);
      const updatedSessions = [session, ...sessions];
      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.log('Error saving session:', error);
    }
  };

  const clearAllSessions = async () => {
    try {
      console.log('Clearing all sessions...');
      await AsyncStorage.removeItem(SESSIONS_STORAGE_KEY);
      setSessions([]);
    } catch (error) {
      console.log('Error clearing sessions:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      console.log('Deleting session:', sessionId);
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.log('Error deleting session:', error);
    }
  };

  return {
    sessions,
    isLoading,
    saveSession,
    clearAllSessions,
    deleteSession,
    loadSessions,
  };
};
