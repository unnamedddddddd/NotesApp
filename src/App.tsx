import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';                  
import { authStore } from '@/stores/authStores';
import Notes from '@/screens/Notes';
import Login from '@/screens/Login';
import Register from '@/screens/Register';
import NoteEdit from '@/screens/NoteEdit';

const Stack = createNativeStackNavigator();

const App = observer(() => {                                 
  const { user } = authStore;

  useEffect(() => { 
    authStore.restore();
  }, []);

  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Notes" component={Notes} />
            <Stack.Screen name="NoteEdit" component={NoteEdit} />
          </>
          
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default App;