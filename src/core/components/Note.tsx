import { NoteProps } from '@/types/NoteProps';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { notesStore } from '@/stores/notesStore';
import { observer } from 'mobx-react-lite';
import { Trash2 } from 'lucide-react-native';
import getRelativeDateString from '@/utilits/getRelativeDareString';

type Props = { note: NoteProps };

type StatusStyle = {
  label: string;
  color: string;
  bg: string;
};

export const STATUS_CONFIG: Record<NoteProps['status'], StatusStyle> = {
  new: {
    label: 'Новая',
    color: '#6da7ec',
    bg: '#032042',
  },
  wip: {
    label: 'В работе',
    color: '#db9300',
    bg: '#311a00',
  },
  completed: {
    label: 'Выполнена',
    color: '#0ca30c',
    bg: '#11260f',
  },
};

const Note = observer(({ note }: Props) => {
  const status = STATUS_CONFIG[note.status];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const noteDeleteProgress = useSharedValue(0);

  const handleEditNote = () => {
    navigation.navigate('NoteEdit', { noteId: note.id })
  };

  const panResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_event, gestureState) => {
        noteDeleteProgress.value = Math.max(0, gestureState.dx);
      },

      onPanResponderRelease: (_event, gestureState) => {
        console.log(gestureState.dx);

        if (gestureState.dx >= 250) {
          notesStore.remove(note.id)
        }

        noteDeleteProgress.value = withSpring(0, {
          mass: 0.5,
          stiffness: 150,
        })

        if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
          handleEditNote();
        }
      },

    }), [note.status, note.id]);

  const animatedNote = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: noteDeleteProgress.value }]
    }
  })

  const animatedNoteTrashBG = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        noteDeleteProgress.value,
        [0, 150],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  const animatedTrashDelete = useAnimatedStyle(() => {
    return {
      opacity: noteDeleteProgress.value,
      transform: [
        {
          scale: interpolate(
            noteDeleteProgress.value,
            [0, 150],
            [0.3, 2],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.main}>
      <Animated.View style={[styles.trashContainer, animatedNoteTrashBG]}>
        <Animated.View style={animatedTrashDelete}>
          <Trash2 size={24} color="#FFDAD6" />
        </Animated.View>
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.noteContainer, animatedNote]}
      >
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>

          <Text style={styles.date}>
            {getRelativeDateString(note.updatedAt).label}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {note.title || 'Без заголовка'}
        </Text>

        <Text style={styles.text} numberOfLines={2}>
          {note.text}
        </Text>
      </Animated.View>
    </View>
  );
});

export default Note;

const styles = StyleSheet.create({
  main: {
    position: 'relative',
  },

  noteContainer: {
    backgroundColor: '#151515',
    padding: 14,
    borderRadius: 12,
  },

  trashContainer: {
    position: 'absolute',
    borderRadius: 13,
    backgroundColor: '#B33A3A',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 24
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  date: {
    color: '#898781',
    fontSize: 12,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#f0efec',
    marginBottom: 4,
  },
  text: {
    color: '#c3c2b7',
    fontSize: 14,
  },
});