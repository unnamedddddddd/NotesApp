import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authStore } from '@/stores/authStores';
import Notes from '@/screens/Notes';
import Login from '@/screens/Login';
import Register from '@/screens/Register';

function App() {
  const { user } = authStore;
  const Stack = createNativeStackNavigator();
  return (
   <NavigationContainer>
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="Notes" component={Notes} options={{ headerShown: false }}/>
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}

      <Stack.Screen name='Register' component={Register} options={{ headerShown: false }}/>
      <Stack.Screen name='Notes' component={Notes} options={{ headerShown: false }}/>

    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;
