import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { ArrowUpDown, Search, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useRef, useState, ComponentRef } from "react"; 
import { SortType } from "@/types/SortType";


type SearchBarProps = {
  onSearch(text: string): void;
  onChangeSortType(sortType: SortType): void;
}

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

  return (
    <View style={styles.container}>
      <Pressable onPress={focusInput} style={styles.searchButton}>
        <Search size={18} color="#898781" />
      </Pressable>
      
      <TextInput
        ref={inputRef}
        style={styles.input}
        onChangeText={(text) => onSearch(text)}
        placeholderTextColor="#898781"
        placeholder='Поиск по названию...'
      />
      
      <Pressable onPress={handleSortNotes} style={styles.sortButton}>
        {sortType === 'start' && <ArrowUpDown size={18} color={'#898781'} />}
        {sortType === 'asc' && <ArrowUp size={18} color={'#898781'} />}
        {sortType === 'desc' && <ArrowDown size={18} color={'#898781'} />}
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
