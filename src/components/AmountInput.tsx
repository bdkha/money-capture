import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

interface AmountInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function AmountInput({ value, onChange }: AmountInputProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.currency}>$</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => {
          // allow digits and single decimal point only
          const clean = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
          onChange(clean);
        }}
        keyboardType="decimal-pad"
        placeholder="0.00"
        placeholderTextColor={Colors.textSecondary}
        autoFocus
        selectionColor={Colors.accent}
      />
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
  currency: {
    color: Colors.textSecondary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    marginRight: 4,
  },
  input: {
    color: Colors.text,
    fontSize: Typography.amount.fontSize,
    fontWeight: Typography.amount.fontWeight,
    minWidth: 120,
    textAlign: 'center',
  },
});
