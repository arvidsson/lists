import 'expo-firestore-offline-persistence';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBnOcRsHiH5qH6IONPyRf8c71UUlyi6UGw',
  authDomain: 'lists-app-123.firebaseapp.com',
  projectId: 'lists-app-123',
  storageBucket: 'lists-app-123.appspot.com',
  messagingSenderId: '987727803556',
  appId: '1:987727803556:web:949d490356e815585de231',
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
export const db = initializeFirestore(app, { localCache: persistentLocalCache() });
