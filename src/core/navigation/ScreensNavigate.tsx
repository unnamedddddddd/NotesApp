import Login from "@/screens/Login";
import NoteEdit from "@/screens/NoteEdit";
import Notes from "@/screens/Notes";
import Register from "@/screens/Register";
import { authStore } from "@/stores/authStores";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";

const Stack = createNativeStackNavigator();

const ScreensNavigate = observer(() => {
  const { user } = authStore;

  return (
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
  )
});

export default ScreensNavigate;