import { ToastAndroid } from "react-native";

export const showError = (error: unknown) => {
  const msg = error instanceof Error ? error.message : 'Что-то пошло не так';
  ToastAndroid.show(msg, ToastAndroid.SHORT);
  console.error(error);
};