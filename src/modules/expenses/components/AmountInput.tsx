import React, { useMemo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontNames } from '../../../shared/theme';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';

interface AmountInputProps {
  value: string;
  onChange: (val: string) => void;
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    input: {
      fontFamily: FontNames.amount,
      fontSize: 56,
      color: c.inkTextPrimary,
      minWidth: 80,
      textAlign: 'center',
    },
    suffix: {
      fontFamily: FontNames.subtitle,
      fontSize: 28,
      color: c.inkTextSecondary,
      marginLeft: 4,
      alignSelf: 'flex-end',
      marginBottom: 6,
    },
  });
}

export default function AmountInput({ value, onChange }: AmountInputProps) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    onChange(clean);
  };

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={colors.inkTextSecondary}
        autoFocus
        selectionColor={colors.orange}
      />
      <Text style={styles.suffix}>đ</Text>
    </View>
  );
}
