import { RootStackParamList } from "@/navigation/types";
import { authStore } from "@/stores/authStores";
import { showError } from "@/utilits/showError";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Lock, ShieldCheck, User } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";

type validMessage = {
  success: boolean;
  message: string;
}

const Register = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = authStore;

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  const handleRegister = async () => {
    try {
      const check: validMessage = checkValidData();
      if (!check.success) {
        ToastAndroid.show(check.message,ToastAndroid.SHORT);
        return;
      }

      await register(login, password);
      ToastAndroid.show('Аккаунт создан', ToastAndroid.SHORT);

      navigation.navigate('Login');
    } catch (error) {
      showError(error);
    }
  }

  const checkValidData = () => {
    if (password !== repeatPassword) {
      return {
        success: false,
        message: 'Пароли не совпадают'
      }
    }

    return {
      success: true,
      message: 'Все ок',
    }
  }

  return (
    <View style={styles.main}>
      <View style={styles.form}>
        <View style={styles.title}>
          <Text style={{ color: '#F1EFE8', fontSize: 22, fontWeight: 500 }}>
            Новый аккаунт
          </Text>
          <Text style={{ color: '#c3c2b7' }}>
            Заметки будут видны только вам
          </Text>
        </View>
        <View style={styles.inputs}>
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <User size={16} color="#898781" strokeWidth={2} />
            </View>
            <TextInput
              value={login}
              onChangeText={setLogin}
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

          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <ShieldCheck size={16} color="#898781" strokeWidth={2} />
            </View>
            <TextInput
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              style={styles.input}
              placeholder="Повторите пароль"
              placeholderTextColor="#898781"
              secureTextEntry
            />
          </View>
        </View>

        <Pressable 
          onPress={handleRegister}
          style={styles.pressableRegister}
        >
          <Text style={styles.buttonText}>Создать аккаунт</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.footer}>
            Уже есть аккаунт?
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.link}>Войти в аккаунт</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default Register;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1F1F1E',
    padding: 24,
    justifyContent: 'center',

  },

  form: {
    gap: 15,
    height: '60%',
    width: '100%'
  },

  title: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 5,
  },

  inputs: {
    gap: 12,
    marginBottom: 10,
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

  pressableRegister: {
    backgroundColor: '#f0efec',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
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
  }


});