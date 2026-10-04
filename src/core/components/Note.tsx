import { NoteProps } from '@/types/NoteProps';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from '@react-navigation/native';

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
    label: 'Готово',
    color: '#0ca30c',
    bg: '#11260f',
  },
};

const Note = ({ note }: Props) => {
  const status = STATUS_CONFIG[note.status];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable 
      onPress={() => navigation.navigate('NoteEdit', {noteId: note.id})}
      style={styles.main}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        <Text style={styles.date}>
          {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {note.title || 'Без заголовка'}
      </Text>

      <Text style={styles.text} numberOfLines={2}>
        {note.text}
      </Text>
    </Pressable>
  );
};

export default Note;

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#151515',
    padding: 14,
    borderRadius: 12,
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