import { Pressable, StyleSheet, Text, View } from "react-native"
import { File } from 'lucide-react-native';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";

const EmptyNotes = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.emptyContainer}>
      <View style={{ backgroundColor: '#151515', padding: 20, borderRadius: '100%' }}>
        <File size={28} color="#c3c2b7" strokeWidth={2} />
      </View>
      <Text style={styles.emptryText}>
        Начните первую заметку
      </Text>
      <View>
        <Text style={styles.emptryText}>
          Записывайте мысли и задачи,
        </Text>
        <Text style={styles.emptryText}>
          меняйте их статус по ходу дела.
        </Text>
      </View>

      <Pressable
        onPress={() => navigation.navigate('NoteEdit', {})}
        style={styles.emptyPressable}
      >
        <Text style={{ color: '#1a1a19', fontSize: 15, textAlign: 'center' }}>
          Создать заметку
        </Text>
      </Pressable>
    </View>
  )
}

export default EmptyNotes;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  emptyPressable: {
    backgroundColor: '#f0efec',
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },

  emptryText: {
    color: '#f0efec',
    textAlign: 'center',
    fontSize: 17,
  },

});