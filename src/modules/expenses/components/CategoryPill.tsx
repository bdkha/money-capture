import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../../../shared/types';
import { CATEGORY_META, Radii, FontNames } from '../../../shared/theme';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';

interface CategoryPillProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
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
}

export default function CategoryPill({ category, selected, onPress }: CategoryPillProps) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
              backgroundColor: colors.ink1,
              borderColor: colors.ink2,
            },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text
        style={[
          styles.label,
          { color: selected ? color : colors.inkTextSecondary },
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
}
