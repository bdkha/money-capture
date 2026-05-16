import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, FontNames } from '../../../shared/theme';

interface AmountInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function AmountInput({ value, onChange }: AmountInputProps) {
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
        placeholderTextColor={Colors.inkTextSecondary}
        autoFocus
        selectionColor={Colors.orange}
      />
      <Text style={styles.suffix}>đ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  input: {
    fontFamily: FontNames.amount,
    fontSize: 56,
    color: Colors.inkTextPrimary,
    minWidth: 80,
    textAlign: 'center',
  },
  suffix: {
    fontFamily: FontNames.subtitle,
    fontSize: 28,
    color: Colors.inkTextSecondary,
    marginLeft: 4,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
});
