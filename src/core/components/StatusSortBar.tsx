import { StatusType } from "@/types/StatusType";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SortStatusType = 'all' | StatusType;

type StatusSortProps = {
  onSort(sortStatus: SortStatusType): void;
}

type Tab = {
  value: SortStatusType;
  label: string;
};

const TABS: Tab[] = [
  {value: 'all' , label: 'Все'},
  {value: 'new' , label: 'Новые'},
  {value: 'wip' , label: 'В работе'},
  {value: 'completed' , label: 'Выполнена'},
];

const StatusSortBar = ({ onSort }: StatusSortProps) => {
  const [sortStatus, setSortStatus] = useState<SortStatusType>('all')

  const handleChangeSort = (status: SortStatusType) => {
    setSortStatus(status);
    onSort(status);
  }

  return (
    <View style={styles.main}>
      {TABS.map(({value, label}) => (
        <Pressable
          key={value}
          onPress={() => handleChangeSort(value)}
          style={[styles.tab, sortStatus === value && styles.tabActive]}        
        >
          <Text style={[styles.text, sortStatus === value && styles.textActive]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default StatusSortBar;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',  
    gap: 5, 
    padding: 15, 
    justifyContent: 'center'
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
  }

});