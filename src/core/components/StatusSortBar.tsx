import { StatusType } from "@/types/StatusType";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Tab from './Tab';

type SortStatusType = 'all' | StatusType;

type StatusSortProps = {
  onSort(sortStatus: SortStatusType): void;
}

type TabItem = {
  value: SortStatusType;
  label: string;
};

const TABS: TabItem[] = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'wip', label: 'В работе' },
  { value: 'completed', label: 'Выполнена' },
];

const StatusSortBar = ({ onSort }: StatusSortProps) => {
  const [sortStatus, setSortStatus] = useState<SortStatusType>('all');

  const handleChangeSort = (status: SortStatusType) => {
    setSortStatus(status);
    onSort(status);
  };

  return (
    <View style={styles.main}>
      {TABS.map(({ value, label }) => (
        <Tab
          key={value}
          label={label}
          active={sortStatus === value}
          onPress={() => handleChangeSort(value)}
        />
      ))}
    </View>
  );
};

export default StatusSortBar;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    gap: 5,
    padding: 15,
    justifyContent: 'center'
  },
});