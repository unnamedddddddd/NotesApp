import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { LogOut, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from "@/components/SearchBar";
import { useCallback, useEffect } from "react";
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
import Animated, { FadeInLeft, LinearTransition, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Notes = observer(() => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const pressableProgress = useSharedValue(1);

  const handleSearch = useCallback(
    debounce((textQuery: string) => {
      notesStore.searchQuery = textQuery;
    }, 400),
    []
  );

  const handleSortNotes = (sortType: SortType) => {
    notesStore.sortType = sortType;
  }

  const handleLogOut = () => {
    authStore.logout();
  }

  const handleSortStatusNotes = (sortStatusType: 'all' | StatusType) => {
    notesStore.sortStatus = sortStatusType;
  }

  const animatedPressable = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pressableProgress.value }]
    }
  });

  const onPressIn = () => {
    pressableProgress.value = withTiming(0.9, { duration: 150 });
  };

  const onPressOut = () => {
    pressableProgress.value = withTiming(1, { duration: 100 });
  };

  useEffect(() => {
    if (authStore.user) {
      notesStore.load(authStore.user);
    }
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
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInLeft.delay(index * 100).duration(300)}
                layout={LinearTransition.springify().mass(0.4)}
              >
                <Note note={item} />
              </Animated.View>
            )}
          />

          <AnimatedPressable
            onPress={() => navigation.navigate('NoteEdit', {})}
            style={[styles.pressable, animatedPressable]}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Plus size={24} color="#1a1a19" strokeWidth={2.5} />
          </AnimatedPressable>
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
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#f0efec',
    borderRadius: 28,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notesContainer: {
    gap: 12,
  }

});