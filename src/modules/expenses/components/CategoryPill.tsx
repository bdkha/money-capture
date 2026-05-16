import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../../../shared/types';
import { Colors, CATEGORY_META, Radii, FontNames } from '../../../shared/theme';

interface CategoryPillProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

export default function CategoryPill({ category, selected, onPress }: CategoryPillProps) {
  const meta = CATEGORY_META[category];
  const { color, emoji } = meta;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.pill,
        selected
          ? {
              backgroundColor: `${color}33`,
              borderColor: color,
            }
          : {
              backgroundColor: Colors.ink1,
              borderColor: Colors.ink2,
            },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text
        style={[
          styles.label,
          { color: selected ? color : Colors.inkTextSecondary },
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.full,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    marginRight: 8,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontFamily: FontNames.bodySemi,
    fontSize: 13,
  },
});
