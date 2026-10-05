import { StatusType } from "@/types/StatusType";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type Tab = {
  label: string;
  active?: boolean;
  onPress?(): void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Tab = ({ label, active, onPress }: Tab) => {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 300 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#1F1F1E', '#f0efec'],
    ),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.tab, animatedStyle]}
    >
      <Text style={[styles.text, active && styles.textActive]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};

export default Tab;

const styles = StyleSheet.create({
  tab: {
    borderWidth: 0.5,
    borderColor: '#3a3a38',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#c3c2b7',
  },

  textActive: {
    color: '#1a1a19',
  }
});