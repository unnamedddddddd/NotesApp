import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStore {
  user: string | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this);
    this.restore();
  }

  async restore() {
    const saved = await AsyncStorage.getItem('session');
    runInAction(() => {
      this.user = saved;
      this.isReady = true;
    })
  }

  async register(login: string, password: string) {
    const users = JSON.parse((await AsyncStorage.getItem('users')) ?? '{}');
    if (users[login]) throw new Error('Такой логин уже занят');

    users[login] = password;

    await AsyncStorage.setItem('users', JSON.stringify(users));
  }

  async login(login: string, password: string) {
    const users = JSON.parse((await AsyncStorage.getItem('users')) ?? '{}');
    if (users[login] !== password) throw new Error('Неверный логин или пароль');

    await AsyncStorage.setItem('session', login);
    runInAction(() => {
      this.user = login;
    });
  }

  async logout() {
    await AsyncStorage.removeItem('session');
    runInAction(() => {
      this.user = null;
    });
  }
}

export const authStore = new AuthStore();