import { FlatList, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { LogOut, File, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { authStore } from "@/stores/authStores";
import StatusSortBar from "@/components/StatusSortBar";
import { notesStore } from "@/stores/notesStore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { observer } from "mobx-react-lite";
import Note from "@/components/Note";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notes = observer(() => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSearch = () => {

  }

  const handleSortNotes = (sortType: 'asc' | 'desc' | 'start') => {
  }

  const handleLogOut = () => {
    authStore.logout();
  }

  const handleSortStatusNotes = (sortStatusType: 'all' | 'new' | 'wip' | 'completed') => {

  }

  const handleEditNote = (noteId: string) => {
    navigation.navigate('NoteEdit', { noteId })
  }

  useEffect(() => {
    if (!authStore.user) {
      console.error('user не загружен');
      return;
    }
    notesStore.load(authStore.user);
  })

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Мои заметки
        </Text>

        <Pressable onPress={handleLogOut}>
          <LogOut size={24} color="#F1EFE8" />
        </Pressable>
      </View>

      {notesStore.notes.length === 0 ? (
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
      ) : (
        <View style={{ flex: 1 }}>
          <SearchBar
            onSearch={handleSearch}
            onChangeSortType={handleSortNotes}
          />

          <StatusSortBar onSort={handleSortStatusNotes} />

          <FlatList
            contentContainerStyle={styles.notesContainer}
            data={notesStore.notes}
            keyExtractor={note => note.id}
            renderItem={({ item }) => (
              <Note note={item} />
            )}
          />

          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            <Pressable
              onPress={() => navigation.navigate('NoteEdit', {})}
              style={styles.pressable}
            >
              <Plus size={24} color="#1a1a19" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
});

export default Notes;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1F1F1E',
    padding: 24,
    gap: 15,
  },

  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },

  title: {
    fontSize: 24,
    fontWeight: 500,
    color: '#f0efec'
  },

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

  pressable: {
    backgroundColor: '#f0efec',
    borderRadius: 28,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  notesContainer: {
    gap: 12,
  }







});