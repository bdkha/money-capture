import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Radii, Spacing, FontNames } from '../../../shared/theme';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';
import { Mood } from '../../../shared/types';

const MOODS: Mood[] = ['😊', '😋', '😂', '😤', '😴'];

interface MoodPickerProps {
  selected: Mood | undefined;
  onChange: (mood: Mood) => void;
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
    },
    row: {
      flexDirection: 'row',
      gap: Spacing.sm,
      justifyContent: 'center',
    },
    button: {
      width: 36,
      height: 36,
      borderRadius: Radii.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 18,
    },
    label: {
      fontFamily: FontNames.body,
      fontSize: 12,
      lineHeight: 17,
      color: c.inkTextSecondary,
      marginTop: Spacing.xs,
    },
  });
}

export default function MoodPicker({ selected, onChange }: MoodPickerProps) {
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handlePress = async (mood: Mood) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(mood);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {MOODS.map((mood) => {
          const isSelected = selected === mood;
          return (
            <TouchableOpacity
              key={mood}
              onPress={() => handlePress(mood)}
              activeOpacity={0.7}
              style={[
                styles.button,
                isSelected
                  ? {
                      backgroundColor: `${colors.orange}33`,
                      borderColor: colors.orange,
                      borderWidth: 1,
                    }
                  : {
                      backgroundColor: colors.ink1,
                      borderColor: 'transparent',
                      borderWidth: 1,
                    },
              ]}
            >
              <Text style={styles.emoji}>{mood}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.label}>{t.mood.label}</Text>
    </View>
  );
}
