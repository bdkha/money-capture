import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native';
import { CATEGORY_META, Spacing, FontNames } from '../../../shared/theme';
import { formatVND } from '../../../shared/utils/currency';
import { Category } from '../../../shared/types';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';

interface CategoryBudgetRowProps {
  category: Category;
  spentCents: number;
  capCents: number;
  onUpdateCap: (newCap: number) => void;
}

export default function CategoryBudgetRow({
  category,
  spentCents,
  capCents,
  onUpdateCap,
}: CategoryBudgetRowProps) {
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const meta = CATEGORY_META[category];
  const pct = capCents > 0 ? Math.min(Math.max(spentCents / capCents, 0), 1) : 0;
  const overspent = spentCents > capCents;
  const barColor = overspent ? colors.danger : meta.color;

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        t.budget.editCapTitle,
        t.budget.editCapMessage,
        (text: string) => {
          const n = parseInt(text, 10);
          if (!isNaN(n) && n > 0) onUpdateCap(n);
        },
        'plain-text',
        String(capCents),
      );
    } else {
      Alert.alert(
        t.budget.editCapTitle,
        t.budget.editCapMessage,
        [
          { text: t.budget.cancel, style: 'cancel' },
          { text: t.budget.save },
        ],
      );
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.row}>
      {/* Emoji circle */}
      <View style={[styles.emojiCircle, { backgroundColor: meta.color + '22' }]}>
        <Text style={styles.emoji}>{meta.emoji}</Text>
      </View>

      {/* Info section */}
      <View style={styles.info}>
        <Text style={styles.categoryName}>{category}</Text>
        {/* Mini progress bar */}
        <View style={styles.miniBarBg}>
          <View
            style={[
              styles.miniBarFill,
              { width: `${pct * 100}%` as any, backgroundColor: barColor },
            ]}
          />
        </View>
      </View>

      {/* Right side */}
      <View style={styles.right}>
        <Text style={styles.spentAmount}>{formatVND(spentCents)}</Text>
        <Text style={styles.capAmount}>/ {formatVND(capCents)}</Text>
        {overspent && (
          <Text style={styles.overspent}>
            {t.budget.overspent + ' ' + formatVND(spentCents - capCents) + ' ' + t.budget.overspentSuffix}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: c.ink2,
    },
    emojiCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 18,
    },
    info: {
      flex: 1,
      marginLeft: 10,
    },
    categoryName: {
      fontFamily: FontNames.bodySemi,
      fontSize: 14,
      color: c.inkTextPrimary,
    },
    miniBarBg: {
      height: 3,
      borderRadius: 2,
      backgroundColor: c.ink2,
      marginTop: 6,
      overflow: 'hidden',
    },
    miniBarFill: {
      height: 3,
      borderRadius: 2,
    },
    right: {
      alignItems: 'flex-end',
      marginLeft: 8,
    },
    spentAmount: {
      fontFamily: FontNames.amountMed,
      fontSize: 13,
      color: c.inkTextPrimary,
    },
    capAmount: {
      fontFamily: FontNames.body,
      fontSize: 11,
      color: c.inkTextSecondary,
    },
    overspent: {
      fontFamily: FontNames.body,
      fontSize: 11,
      color: c.danger,
      marginTop: 2,
    },
  });
}
