import React, { useEffect } from 'react';
import { LogBox, Alert, StyleSheet } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged, signInAnonymously, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createNativeStackNavigator();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALAciQB_zxI8PgiZw6YM-J0wY5iE0R4z4",
  authDomain: "shopping-list-demo-b3785.firebaseapp.com",
  projectId: "shopping-list-demo-b3785",
  storageBucket: "shopping-list-demo-b3785.appspot.com",
  messagingSenderId: "738562661564",
  appId: "1:738562661564:web:99e3159bf3d7a02d5a44b9"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  console.log("Initializing Firebase app...");
  app = initializeApp(firebaseConfig);
} else {
  console.log("Firebase app already initialized, using existing app...");
  app = getApp();
}

const db = getFirestore(app);
const storage = getStorage(app);
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  if (e.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw e;
  }
}

const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth)
          .then(() => {
            console.log('Signed in anonymously');
          })
          .catch((error) => {
            console.error('Unable to sign in:', error.message);
            Alert.alert('Unable to sign in', error.message);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;