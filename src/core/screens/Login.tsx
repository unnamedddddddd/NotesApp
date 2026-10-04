import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { FileText, Lock, User } from "lucide-react-native";
import { Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native"
import { useEffect, useState } from "react";
import { authStore } from "@/stores/authStores";
import { showError } from "@/utilits/showError";


const Login = () => {
  const [userLogin, setUserLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    try {
      if (!userLogin.trim() || !password.trim()) {
        throw new Error('Поля обязательны');
      }

      authStore.login(userLogin, password);
    } catch (error) {
      showError(error);
    }
  }



  return (
    <View style={styles.main}>
      <View style={styles.form}>
        <View style={styles.iconCircle}>
          <FileText size={40} color="#4A90E2" strokeWidth={2} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Заметки</Text>
          <Text style={styles.subtitle}>
            Войдите, чтобы увидеть свои записи
          </Text>
        </View>

        <View style={styles.inputs}>
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <User size={16} color="#898781" strokeWidth={2} />
            </View>
            <TextInput
              value={userLogin}
              onChangeText={setUserLogin}
              style={styles.input}
              placeholder="Логин"
              placeholderTextColor="#898781"
              autoCapitalize="none"

            />
          </View>

          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Lock size={16} color="#898781" strokeWidth={2} />
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#898781"
              secureTextEntry
            />
          </View>
        </View>

        <Pressable 
        onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Войти</Text>
        </Pressable>

        <View style={{flexDirection: 'row', gap: 5, justifyContent: 'center',alignItems: 'center'}}>
          <Text style={styles.footer}>
            Нет аккаунта? 
          </Text>
          <Pressable 
            style={styles.pressable}
            onPress={() => navigation.navigate('Register')}
          >
              <Text style={styles.link}>Зарегистрироваться</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1F1F1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  form: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#0D1B2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },

  title: {
    color: '#F1EFE8',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    color: '#B4B2A9',
    fontSize: 14,
    textAlign: 'center',
  },

  inputs: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  iconWrap: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    padding: 0,
  },

  button: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0efec',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },

  footer: {
    color: '#898781',
    fontSize: 13,
  },

  link: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});