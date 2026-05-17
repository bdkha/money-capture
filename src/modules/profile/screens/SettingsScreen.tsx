import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radii, FontNames } from '../../../shared/theme';
import { useColors, useTheme, ColorTokens, ThemeMode } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';
import { Language } from '../../../shared/i18n/translations';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const { t, language, setLanguage } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const navigation = useNavigation();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.inkTextPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.profile.settings}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsCard}>
          {/* Theme row */}
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Ionicons name="contrast-outline" size={20} color={colors.inkTextSecondary} />
              <Text style={styles.settingsLabel}>{t.profile.theme}</Text>
            </View>
            <View style={styles.segmented}>
              {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.segment, mode === m && styles.segmentActive]}
                  onPress={() => setMode(m)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentText, mode === m && styles.segmentTextActive]}>
                    {m === 'light' ? t.profile.themeLight : m === 'dark' ? t.profile.themeDark : t.profile.themeSystem}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Language row */}
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Ionicons name="globe-outline" size={20} color={colors.inkTextSecondary} />
              <Text style={styles.settingsLabel}>{t.profile.language}</Text>
            </View>
            <View style={styles.segmented}>
              {(['vi', 'en'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.segment, language === lang && styles.segmentActive]}
                  onPress={() => setLanguage(lang)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentText, language === lang && styles.segmentTextActive]}>
                    {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.ink0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
    },
    backBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontFamily: FontNames.title,
      fontSize: 18,
      color: c.inkTextPrimary,
    },
    content: {
      padding: Spacing.lg,
    },
    settingsCard: {
      backgroundColor: c.cardBg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.ink2,
      overflow: 'hidden',
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: 14,
    },
    settingsRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    settingsLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 15,
      color: c.inkTextPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: c.ink2,
      marginHorizontal: Spacing.lg,
    },
    segmented: {
      flexDirection: 'row',
      backgroundColor: c.ink1,
      borderRadius: Radii.md,
      padding: 2,
      gap: 2,
    },
    segment: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: Radii.sm,
    },
    segmentActive: {
      backgroundColor: c.cardBg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    segmentText: {
      fontFamily: FontNames.bodyMed,
      fontSize: 12,
      color: c.inkTextSecondary,
    },
    segmentTextActive: {
      color: c.inkTextPrimary,
    },
  });
}
