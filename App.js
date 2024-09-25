import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from './components/Start';
import Chat from './components/Chat';
import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen
          name="Screen1"
          component={Start}
        />
        <Stack.Screen
          name="Screen2"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//export default App;