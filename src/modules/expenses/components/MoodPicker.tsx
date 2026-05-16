import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radii, Spacing, FontNames } from '../../../shared/theme';
import { Mood } from '../../../shared/types';

const MOODS: Mood[] = ['😊', '😋', '😂', '😤', '😴'];

interface MoodPickerProps {
  selected: Mood | undefined;
  onChange: (mood: Mood) => void;
}

export default function MoodPicker({ selected, onChange }: MoodPickerProps) {
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
                      backgroundColor: `${Colors.orange}33`,
                      borderColor: Colors.orange,
                      borderWidth: 1,
                    }
                  : {
                      backgroundColor: Colors.ink1,
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
      <Text style={styles.label}>Cảm xúc</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: Colors.inkTextSecondary,
    marginTop: Spacing.xs,
  },
});
