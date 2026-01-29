import { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const DataContext = createContext();

const defaultData = {
  dailyLogs: [],
  startDate: new Date().toISOString().split('T')[0],
  settings: {
    weeklyGoals: {
      leetcode: 13,
      systemDesign: 2,
      mlTheory: 1,
      projects: 1
    }
  },
  // Phase 1: Add empty arrays for future features
  skills: [],
  resources: [],
  problemNotes: {},
  projects: [],
  researchPapers: [],
  achievements: [],
  studyGroups: [],
  trainingLogs: [],
  theme: 'dark',
  version: 3
};

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState(defaultData);
  const [saving, setSaving] = useState(false);

  // Real-time Firestore listener
  useEffect(() => {
    const ownerUID = import.meta.env.VITE_PUBLIC_OWNER_UID;
    const userToFetch = user ? user.uid : ownerUID;

    if (!userToFetch || userToFetch === 'YOUR_USER_ID_HERE') {
      setData(defaultData);
      return;
    }

    const docRef = doc(db, 'users', userToFetch);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Ensure all new fields exist with defaults
        setData({
          ...defaultData,
          ...userData,
          skills: userData.skills || [],
          resources: userData.resources || [],
          problemNotes: userData.problemNotes || {},
          projects: userData.projects || [],
          researchPapers: userData.researchPapers || [],
          achievements: userData.achievements || [],
          studyGroups: userData.studyGroups || [],
          trainingLogs: userData.trainingLogs || [],
          theme: userData.theme || 'dark',
          version: userData.version || 3
        });
      } else if (user) {
        // Initialize new user data only if they're logged in
        setDoc(docRef, defaultData);
      } else {
        // Owner hasn't created data yet
        setData(defaultData);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const updateData = async (newData) => {
    if (!user) return;

    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, newData, { merge: true });
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addDailyLog = async (log) => {
    if (!user) return;

    const existingLogIndex = data.dailyLogs.findIndex(l => l.date === log.date);
    const updatedLogs = [...data.dailyLogs];

    if (existingLogIndex >= 0) {
      updatedLogs[existingLogIndex] = log;
    } else {
      updatedLogs.push(log);
    }

    await updateData({ dailyLogs: updatedLogs });
  };

  const value = {
    data,
    saving,
    updateData,
    addDailyLog,
    isReadOnly: !user
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
