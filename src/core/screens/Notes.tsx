import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { LogOut, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from "@/components/SearchBar";
import { useEffect } from "react";
import { authStore } from "@/stores/authStores";
import StatusSortBar from "@/components/StatusSortBar";
import { notesStore } from "@/stores/notesStore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { observer } from "mobx-react-lite";
import Note from "@/components/Note";
import EmptyNotes from "@/components/EmptyNotes";
import { StatusType } from "@/types/StatusType";
import { SortType } from "@/types/SortType";
import debounce from "@/utilits/debounce";

const Notes = observer(() => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const deb = debounce((textQuery: string) => notesStore.searchQuery = textQuery, 400)

  const handleSearch = (textQuery: string) => {
    deb(textQuery);
  }

  const handleSortNotes = (sortType: SortType) => {
    notesStore.sortType = sortType;
  }

  const handleLogOut = () => {
    authStore.logout();
  }

  const handleSortStatusNotes = (sortStatusType: 'all' | StatusType) => {
    notesStore.sortStatus = sortStatusType;

  }

  useEffect(() => {
    if (!authStore.user) {
      console.error('user не загружен');
      return;
    }
    notesStore.load(authStore.user);
  }, [])

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
        <EmptyNotes />
      ) : (
        <View style={{ flex: 1 }}>
          <SearchBar
            onSearch={handleSearch}
            onChangeSortType={handleSortNotes}
          />

          <StatusSortBar onSort={handleSortStatusNotes} />

          <FlatList
            contentContainerStyle={styles.notesContainer}
            data={notesStore.sortNotes}
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