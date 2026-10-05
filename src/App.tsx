import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';                  
import { authStore } from '@/stores/authStores';
import ScreensNavigate from '@/navigation/ScreensNavigate';

const App = observer(() => {                                 
  useEffect(() => { 
    authStore.restore();
  }, []);

  return (
    <NavigationContainer>
      <ScreensNavigate />
    </NavigationContainer>
  );
});

export default App;