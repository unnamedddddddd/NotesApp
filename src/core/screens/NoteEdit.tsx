import type { RootStackParamList } from "@/navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import { ArrowLeft, Trash2, Check, Save } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { notesStore } from "@/stores/notesStore";
import { showError } from "@/utilits/showError";
import { StatusType } from "@/types/StatusType";
import Tab from "@/components/Tab";
import getRelativeDateString from "@/utilits/getRelativeDareString";

type TabItem = {
  value: StatusType;
  label: string;
};

const TABS: TabItem[] = [
  { value: 'new', label: 'Новые' },
  { value: 'wip', label: 'В работе' },
  { value: 'completed', label: 'Выполнена' },
];

const NoteEdit = observer(() => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'NoteEdit'>>();
  const noteId = route.params?.noteId;

  const [status, setStatus] = useState<StatusType>('new');
  const [textNote, setTextNote] = useState<string>('');
  const [titleNote, setTitleNote] = useState<string>('');
  const [updateAtNote, setUpdateAtNote] = useState<number>(0);

  const saveNote = async () => {
    try {
      if (noteId) {
        await notesStore.save(titleNote, textNote, status, noteId);
      } else {
        await notesStore.save(titleNote, textNote, status);
      }
      ToastAndroid.show('Заметка сохранена', ToastAndroid.SHORT);
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    if (noteId) {
      const note = notesStore.get(noteId);
      if (note) {
        setStatus(note?.status);
        setTextNote(note?.text);
        setTitleNote(note?.title);
        setUpdateAtNote(note?.updatedAt);
      }
    }
  }, [])

  const handleBack = async () => {
    if (noteId) {
      await saveNote();
    }
    navigation.goBack()
  }

  const handleDeleteNote = async () => {
    if (noteId) {
      await notesStore.remove(noteId);
      ToastAndroid.show('Заметка удалена', ToastAndroid.SHORT);
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Pressable
          hitSlop={8}
          onPress={handleBack}
        >
          <ArrowLeft size={24} color="#c3c2b7" />
        </Pressable>
        <View style={styles.headerEditProps}>
          <Pressable
            hitSlop={8}
            onPress={handleDeleteNote}
          >
            <Trash2 size={24} color="#ec7e7e" />
          </Pressable>
          <Pressable
            hitSlop={8}
            onPress={saveNote}
          >
            <Save size={24} color="#6da7ec" />
          </Pressable>
        </View>
      </View>
      <View style={styles.statusSection}>
        <Text style={{ color: '#898781' }}>
          Статус
        </Text>
        <View style={styles.statusContainer}>
          {TABS.map(({ value, label }) => (
            <Tab
              key={value}
              label={label}
              active={status === value}
              onPress={() => setStatus(value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.inputsSections}>
        <TextInput
          style={styles.inputTitle}
          value={titleNote}
          onChangeText={setTitleNote}
          placeholderTextColor={'#898781'}
          placeholder="Без заголовка"
        />
        <TextInput
          style={styles.input}
          value={textNote}
          onChangeText={setTextNote}
          placeholderTextColor={'#f0efec'}
          placeholder="Текст заметки"
          multiline
        />
      </View>

      {noteId && (
        <View style={styles.updateAtText}>
          <Text style={{ color: '#898781', fontSize: 15 }}>
            Заметка была обновлена {getRelativeDateString(updateAtNote).label} в {getRelativeDateString(updateAtNote).time}
          </Text>
        </View>
      )}

    </SafeAreaView>
  );

});

export default NoteEdit

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1F1F1E',
    padding: 24,
    gap: 5
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerEditProps: {
    gap: 20,
    flexDirection: 'row',
  },

  tab: {
    borderWidth: 0.5,
    borderColor: '#3a3a38',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabActive: {
    backgroundColor: '#f0efec',
  },

  text: {
    color: '#c3c2b7',
  },

  textActive: {
    color: '#1a1a19',
  },

  statusContainer: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 13,
  },

  statusSection: {
    marginTop: 10,
  },

  inputsSections: {
    backgroundColor: '#151515',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  inputTitle: {
    color: '#f0efec',
    fontSize: 22,
    fontWeight: '500',
  },

  input: {
    color: '#f0efec',
    flex: 1,
    fontSize: 18,
    textAlignVertical: 'top',
  },

  updateAtText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  }

});