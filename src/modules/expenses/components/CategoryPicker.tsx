import React from 'react';
import { ScrollView, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Category, CATEGORIES } from '../../../shared/types';
import { Colors, Spacing, Radii, FontNames } from '../../../shared/theme';
import CategoryPill from './CategoryPill';

interface CategoryPickerProps {
  selected: Category;
  onChange: (category: Category) => void;
}

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  const handleAddPress = () => {
    Alert.alert('Sắp ra mắt', 'Danh mục tuỳ chỉnh sẽ sớm có.');
  };

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

      {/* Stub "+" pill */}
      <TouchableOpacity
        onPress={handleAddPress}
        activeOpacity={0.7}
        style={styles.stubPill}
      >
        <Text style={styles.stubText}>+ Thêm</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
  },
  stubPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.inkTextSecondary,
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  stubText: {
    fontFamily: FontNames.bodySemi,
    fontSize: 13,
    color: Colors.inkTextSecondary,
  },
});
