import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Import the functions you need from the SDKs you need
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import the screens
import ShoppingLists from './components/ShoppingLists';
import Chat from './components/Chat';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
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
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Start"
    >
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen
        name="Chat"
      >
        {props => <Chat db={db} {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
  );
};
//export default App;