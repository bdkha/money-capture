import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Category, CATEGORIES } from '../../../shared/types';
import { Spacing, Radii, FontNames } from '../../../shared/theme';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';
import CategoryPill from './CategoryPill';

interface CategoryPickerProps {
  selected: Category;
  onChange: (category: Category) => void;
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
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
      borderColor: c.inkTextSecondary,
      borderStyle: 'dashed',
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      backgroundColor: 'transparent',
    },
    stubText: {
      fontFamily: FontNames.bodySemi,
      fontSize: 13,
      color: c.inkTextSecondary,
    },
  });
}

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleAddPress = () => {
    Alert.alert(t.category.addMoreAlertTitle, t.category.addMoreAlertBody, [
      { text: t.category.ok },
    ]);
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
        <Text style={styles.stubText}>{t.category.addMore}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
