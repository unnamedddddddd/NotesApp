import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { ArrowUpDown, Search, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useRef, useState, ComponentRef, useEffect } from "react";
import type { SortType } from "@/types/SortType";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type SearchBarProps = {
  onSearch(text: string): void;
  onChangeSortType(sortType: SortType): void;
}

const AnimatedArrowUp = Animated.createAnimatedComponent(ArrowUp);
const AnimatedArrowDown = Animated.createAnimatedComponent(ArrowDown);

const SearchBar = ({ onSearch, onChangeSortType }: SearchBarProps) => {
  const [sortType, setSortType] = useState<SortType>('start');
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  const handleSortNotes = () => {
    let next: SortType;
    if (sortType === 'start') next = 'asc';
    else if (sortType === 'asc') next = 'desc';
    else next = 'start';

    setSortType(next);
    onChangeSortType(next);
  }

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const progressValue = useSharedValue(0);

  const animatedArrow = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: progressValue.value }]
    }
  });

  useEffect(() => {
    if (sortType === 'start') return;

    const offset = sortType === 'asc' ? 10 : -10;
    progressValue.value = offset;
    progressValue.value = withSpring(0, { mass: 0.5, stiffness: 150 });
  }, [sortType]);

  return (
    <View style={styles.container}>
      <Pressable onPress={focusInput} style={styles.searchButton}>
        <Search size={18} color="#898781" />
      </Pressable>

      <TextInput
        ref={inputRef}
        style={styles.input}
        onChangeText={onSearch}
        placeholderTextColor="#898781"
        placeholder='Поиск по названию...'
      />

      <Pressable onPress={handleSortNotes} style={styles.sortButton}>
        {sortType === 'start' && <ArrowUpDown size={18} color={'#898781'} />}
        {sortType === 'asc' && <AnimatedArrowUp size={18} color={'#898781'} style={animatedArrow} />}
        {sortType === 'desc' && <AnimatedArrowDown size={18} color={'#898781'} style={animatedArrow} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  searchButton: {
    backgroundColor: '#151515',
    paddingLeft: 12,
    paddingRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  input: {
    backgroundColor: '#151515',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flex: 1,
    color: '#F1EFE8',
  },
  sortButton: {
    backgroundColor: '#151515',
    padding: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;
