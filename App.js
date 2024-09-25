import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator // initialRouteName is the first screen that will be displayed.
        initialRouteName="Screen1"
      >
        <Stack.Screen
          name="Screen1"
          component={Screen1} // component is the screen that will be displayed. the Screen1 comes from initialRouteName.
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; //android emulator part started

