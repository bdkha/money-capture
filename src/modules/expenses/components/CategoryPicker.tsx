import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Category, CATEGORIES } from '../types';
import { Spacing } from '../theme';
import CategoryPill from './CategoryPill';

interface CategoryPickerProps {
  selected: Category;
  onChange: (category: Category) => void;
}

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.scroll}
    >
      {CATEGORIES.map((cat) => (
        <CategoryPill
          key={cat}
          category={cat}
          selected={selected === cat}
          onPress={() => onChange(cat)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});
