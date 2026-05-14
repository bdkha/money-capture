import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Category } from '../types';
import { Colors, Radii, Spacing } from '../theme';

interface CategoryPillProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

const EMOJI: Record<Category, string> = {
  Food: '🍜',
  Transport: '🚌',
  Shopping: '🛍',
  Bills: '📄',
  Entertainment: '🎬',
  Health: '💊',
  Other: '📦',
};

export default function CategoryPill({ category, selected, onPress }: CategoryPillProps) {
  const color = Colors.categories[category];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        selected
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: Colors.surface, borderColor: Colors.border },
      ]}
    >
      <Text style={styles.emoji}>{EMOJI[category]}</Text>
      <Text style={[styles.label, { color: selected ? '#000' : Colors.textSecondary }]}>
        {category}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.xs,
    marginRight: Spacing.sm,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
