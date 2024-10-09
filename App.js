import React from 'react';
import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useNetInfo }from '@react-native-community/netinfo'; // <<<<< this isn't a regular function it acts as a react hook.
import { useEffect } from 'react';
import { LogBox, Alert, StyleSheet } from 'react-native';
import { getStorage } from "firebase/storage";
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => { //NetInfo Implemented with its alert.

  const connectionStatus = useNetInfo(); //this is a hook that returns the network status of the device.
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db); //offline implemented
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db); //online implemented
    }
  }, [connectionStatus.isConnected]);
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyALAciQB_zxI8PgiZw6YM-J0wY5iE0R4z4",
    authDomain: "shopping-list-demo-b3785.firebaseapp.com",
    projectId: "shopping-list-demo-b3785",
    storageBucket: "shopping-list-demo-b3785.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);//this initializes the firebase app with the firebase configuration.
  const db = getFirestore(app);//this is the firestore database reference that will be used to read and write data.
  const storage = getStorage(app); //this is the storage reference that will be used to upload and download images.

  //the db variable is passed as a db prop however, the db prop can be passed under a different name - eg. db={database}
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
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
export default App;