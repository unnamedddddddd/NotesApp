import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { makeAutoObservable, runInAction } from 'mobx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

class TestStore {
  counter = 0;
  status: 'idle' | 'loading' | 'done' = 'idle';
  apiResult = '';
  storageResult = '';

  constructor() {
    makeAutoObservable(this);
  }

  get doubled() {
    return this.counter * 2;
  }

  inc = () => {
    this.counter += 1;
  };

  dec = () => {
    this.counter -= 1;
  };

  testStorage = async () => {
    this.status = 'loading';
    try {
      await AsyncStorage.setItem('@test:key', 'hello from storage');
      const val = await AsyncStorage.getItem('@test:key');
      runInAction(() => {
        this.storageResult = val ?? '(null)';
        this.status = 'done';
      });
    } catch (e) {
      runInAction(() => {
        this.storageResult = 'ERROR: ' + String(e);
        this.status = 'done';
      });
    }
  };

  testAxios = async () => {
    this.status = 'loading';
    try {
      const { data } = await axios.get<{ title: string }>(
        'https://jsonplaceholder.typicode.com/todos/1',
        { timeout: 10000 },
      );
      runInAction(() => {
        this.apiResult = data.title;
        this.status = 'done';
      });
    } catch (e) {
      runInAction(() => {
        this.apiResult = 'ERROR: ' + (e as Error).message;
        this.status = 'done';
      });
    }
  };

  testDateFns = () => {
    return format(new Date(), 'd MMMM yyyy, HH:mm', { locale: ru });
  };
}

const testStore = new TestStore();

// ── AnimatedBox на встроенном Animated ──
const AnimatedBox: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 1.5,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.boxInner}
      >
        <Text style={styles.boxText}>Animated</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomeScreen: React.FC = observer(() => {
  const isDarkMode = useColorScheme() === 'dark';
  const [dateStr, setDateStr] = useState('—');

  useEffect(() => {
    setDateStr(testStore.testDateFns());
  }, []);

  return (
    <View style={[styles.screen, isDarkMode && styles.screenDark]}>
      <Text style={styles.title}>Проверка библиотек</Text>

      <Text style={styles.item}>✅ react-native — работает</Text>
      <Text style={styles.item}>✅ mobx — counter = {testStore.counter}</Text>
      <Text style={styles.item}>✅ mobx — doubled = {testStore.doubled}</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={testStore.dec}>
          <Text style={styles.btnText}>−1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={testStore.inc}>
          <Text style={styles.btnText}>+1</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.item}>✅ date-fns — {dateStr}</Text>

      <Text style={styles.item}>✅ Animated (RN) — нажми на квадрат:</Text>
      <AnimatedBox />

      <TouchableOpacity style={styles.btn} onPress={testStore.testStorage}>
        <Text style={styles.btnText}>Проверить AsyncStorage</Text>
      </TouchableOpacity>
      <Text style={styles.item}>storage: {testStore.storageResult || '—'}</Text>

      <TouchableOpacity style={styles.btn} onPress={testStore.testAxios}>
        <Text style={styles.btnText}>Проверить axios</Text>
      </TouchableOpacity>
      <Text style={styles.item}>api: {testStore.apiResult || '—'}</Text>

      {testStore.status === 'loading' && (
        <ActivityIndicator style={styles.spinner} />
      )}
    </View>
  );
});

const DetailScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Detail Screen</Text>
    <Text style={styles.item}>✅ @react-navigation/native — работает</Text>
    <Text style={styles.item}>✅ native-stack — работает</Text>
  </View>
);

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  screenDark: {
    backgroundColor: '#111',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  item: {
    fontSize: 15,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#34C759',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  boxInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: '#fff',
    fontWeight: '700',
  },
  spinner: {
    marginTop: 8,
  },
});