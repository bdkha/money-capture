import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CATEGORY_META, Colors, Spacing, FontNames } from '../../../shared/theme';
import { Category } from '../../../shared/types';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';

interface Props {
  visible: boolean;
  category: Category;
  spentCents: number;
  capCents: number;
  onSave: (newCap: number) => void;
  onClose: () => void;
}

const PRESETS = [500, 1000, 1500, 2000, 3000, 5000];
const PRESET_LABELS = ['500k', '1tr', '1.5tr', '2tr', '3tr', '5tr'];

export default function EditBudgetModal({
  visible,
  category,
  spentCents,
  capCents,
  onSave,
  onClose,
}: Props) {
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const meta = CATEGORY_META[category];

  const [inputVal, setInputVal] = useState(String(Math.round(capCents / 1000)));

  useEffect(() => {
    if (visible) {
      setInputVal(String(Math.round(capCents / 1000)));
    }
  }, [visible, capCents]);

  const newCapCents = (parseInt(inputVal, 10) || 0) * 1000;
  const remaining = newCapCents - spentCents;
  const remainingNegative = remaining < 0;

  const handleSave = () => {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n > 0) {
      onSave(n * 1000);
    }
    onClose();
  };

  const formatRemaining = (val: number) => {
    const abs = Math.abs(val);
    if (abs >= 1_000_000) return `${(val / 1_000_000).toFixed(1).replace('.0', '')}tr`;
    if (abs >= 1_000) return `${Math.round(val / 1_000)}k`;
    return String(val);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.card} onPress={() => {}}>

            {/* Close button */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            {/* Header: emoji + title + category name */}
            <View style={styles.header}>
              <View style={[styles.emojiBox, { backgroundColor: '#3b2418' }]}>
                <Text style={styles.emojiText}>{meta.emoji}</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerLabel}>{t.budget.editCapTitle}</Text>
                <Text style={styles.headerTitle}>{category}</Text>
              </View>
            </View>

            {/* Đã chi tháng này */}
            <Text style={styles.sectionLabel}>{t.budget.spentThisMonth}</Text>
            <View style={styles.displayBox}>
              <Text style={styles.displayAmount}>{Math.round(spentCents / 1000)}</Text>
              <Text style={styles.displaySuffix}>.000đ</Text>
            </View>

            {/* Ngân quỹ tháng */}
            <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>{t.budget.monthlyBudget}</Text>
            <View style={[styles.inputRow, { borderColor: Colors.orange }]}>
              <TextInput
                style={styles.input}
                value={inputVal}
                onChangeText={(v) => setInputVal(v.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                selectTextOnFocus
              />
              <Text style={styles.inputSuffix}>.000đ</Text>
            </View>
            <Text style={[styles.remainingHint, remainingNegative && { color: colors.danger }]}>
              {`${t.budget.remaining}: ${remainingNegative ? '' : '+'}${formatRemaining(remaining)}`}
            </Text>

            {/* Presets */}
            <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>{t.budget.quick}</Text>
            <View style={styles.presetsGrid}>
              {PRESETS.map((p, i) => (
                <TouchableOpacity
                  key={p}
                  style={styles.presetBtn}
                  onPress={() => setInputVal(String(p))}
                >
                  <Text style={styles.presetLabel}>{PRESET_LABELS[i]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>{t.budget.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>✓ {t.budget.save}</Text>
              </TouchableOpacity>
            </View>

          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    flex: { flex: 1 },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
    },
    card: {
      backgroundColor: c.cardBg,
      borderRadius: 28,
      padding: 22,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.35,
      shadowRadius: 30,
      elevation: 20,
    },
    closeBtn: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.ink2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      fontSize: 14,
      color: c.inkTextSecondary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xl,
      marginRight: 40,
    },
    emojiBox: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emojiText: { fontSize: 28 },
    headerText: { marginLeft: 16 },
    headerLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 11,
      color: c.inkTextSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.88,
    },
    headerTitle: {
      fontFamily: FontNames.title,
      fontSize: 20,
      color: c.inkTextPrimary,
      letterSpacing: -0.4,
    },
    sectionLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 12,
      color: c.inkTextSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.96,
      marginBottom: 8,
    },
    displayBox: {
      flexDirection: 'row',
      alignItems: 'baseline',
      backgroundColor: c.ink1,
      borderRadius: 16,
      borderWidth: 0.8,
      borderColor: c.ink2,
      paddingHorizontal: 17,
      paddingVertical: 15,
    },
    displayAmount: {
      fontFamily: FontNames.amount,
      fontSize: 24,
      color: c.inkTextPrimary,
      letterSpacing: -0.48,
    },
    displaySuffix: {
      fontFamily: FontNames.body,
      fontSize: 16,
      color: c.inkTextSecondary,
      marginLeft: 2,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardBg,
      borderRadius: 16,
      borderWidth: 1.6,
      paddingHorizontal: 17,
      paddingVertical: 15,
    },
    input: {
      flex: 1,
      fontFamily: FontNames.amount,
      fontSize: 24,
      color: c.inkTextPrimary,
      letterSpacing: -0.48,
      padding: 0,
    },
    inputSuffix: {
      fontFamily: FontNames.bodySemi,
      fontSize: 16,
      color: c.inkTextSecondary,
    },
    remainingHint: {
      fontFamily: FontNames.body,
      fontSize: 12,
      color: c.inkTextSecondary,
      marginTop: 6,
      marginLeft: 4,
    },
    presetsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    presetBtn: {
      backgroundColor: c.ink1,
      borderRadius: 12,
      borderWidth: 0.8,
      borderColor: c.ink3,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    presetLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 13,
      color: c.inkTextPrimary,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: Spacing.xl,
    },
    cancelBtn: {
      flex: 1,
      height: 52,
      borderRadius: 18,
      backgroundColor: c.ink2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelText: {
      fontFamily: FontNames.bodySemi,
      fontSize: 16,
      color: c.inkTextPrimary,
    },
    saveBtn: {
      flex: 1,
      height: 52,
      borderRadius: 18,
      backgroundColor: Colors.orange,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: Colors.orange,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
    saveText: {
      fontFamily: FontNames.bodySemi,
      fontSize: 16,
      color: '#FFF',
    },
  });
}
