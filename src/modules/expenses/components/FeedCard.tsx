import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { format, parseISO } from 'date-fns';
import { Expense } from '../../../shared/types';
import { CATEGORY_META, Spacing, Radii, FontNames } from '../../../shared/theme';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { formatVND } from '../../../shared/utils/currency';

interface FeedCardProps {
  expense: Expense;
  onDelete: () => void;
}

const CARD_WIDTH = Dimensions.get('window').width - Spacing.lg * 2;

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    wrapper: {
      width: CARD_WIDTH,
      marginBottom: 4,
    },
    card: {
      width: CARD_WIDTH,
      aspectRatio: 1,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: c.ink2,
    },
    categoryPill: {
      position: 'absolute',
      top: 8,
      left: 8,
      zIndex: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: Radii.full,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    categoryEmoji: {
      fontSize: 10,
    },
    categoryLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 10,
    },
    timePill: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 10,
      backgroundColor: 'rgba(20,14,10,0.55)',
      borderRadius: Radii.full,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    timeText: {
      fontFamily: FontNames.bodyMed,
      fontSize: 10,
      color: '#FFFFFF',
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60%',
    },
    bottomRow: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      right: 10,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    bottomLeft: {
      flex: 1,
      marginRight: 8,
    },
    merchantText: {
      fontFamily: FontNames.bodySemi,
      fontSize: 13,
      color: '#FFFFFF',
      marginBottom: 2,
    },
    amountText: {
      fontFamily: FontNames.amount,
      fontSize: 22,
      color: '#FFFFFF',
    },
    moodEmoji: {
      fontSize: 22,
    },
    reactionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 4,
      paddingVertical: 6,
    },
    reactionText: {
      fontFamily: FontNames.body,
      fontSize: 12,
      lineHeight: 17,
      color: c.inkTextSecondary,
    },
    addReactionButton: {
      width: 24,
      height: 24,
      borderRadius: Radii.full,
      backgroundColor: c.ink1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export default function FeedCard({ expense, onDelete }: FeedCardProps) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const meta = CATEGORY_META[expense.category];

  const handleLongPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete();
  };

  return (
    <View style={styles.wrapper}>
      {/* Card with photo */}
      <TouchableOpacity
        activeOpacity={0.95}
        onLongPress={handleLongPress}
        style={styles.card}
      >
        {/* Full-screen photo */}
        <Image
          source={{ uri: expense.photoUri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Category pill - top left */}
        <View
          style={[
            styles.categoryPill,
            {
              backgroundColor: `${meta.color}33`,
              borderColor: `${meta.color}66`,
            },
          ]}
        >
          <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
          <Text style={[styles.categoryLabel, { color: meta.color }]}>
            {expense.category}
          </Text>
        </View>

        {/* Time pill - top right */}
        <View style={styles.timePill}>
          <Text style={styles.timeText}>
            {format(parseISO(expense.createdAt), 'HH:mm')}
          </Text>
        </View>

        {/* Bottom gradient overlay — always dark (photo overlay) */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.gradient}
          pointerEvents="none"
        />

        {/* Bottom info row */}
        <View style={styles.bottomRow}>
          <View style={styles.bottomLeft}>
            <Text style={styles.merchantText} numberOfLines={1}>
              {expense.note || expense.category}
            </Text>
            <Text style={styles.amountText}>{formatVND(expense.amount)}</Text>
          </View>
          {expense.mood ? (
            <Text style={styles.moodEmoji}>{expense.mood}</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Reaction stub below card */}
      <View style={styles.reactionRow}>
        <Text style={styles.reactionText}>❤️ 2</Text>
        <Text style={styles.reactionText}>🤤 1</Text>
        <TouchableOpacity style={styles.addReactionButton} activeOpacity={0.7}>
          <Ionicons name="add" size={14} color={colors.inkTextSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
