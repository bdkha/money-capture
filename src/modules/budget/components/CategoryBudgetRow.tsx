import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CATEGORY_META, FontNames } from "../../../shared/theme";
import { formatVND } from "../../../shared/utils/currency";
import { Category } from "../../../shared/types";
import { useColors, ColorTokens } from "../../../shared/theme/ThemeContext";
import { useI18n } from "../../../shared/i18n/I18nContext";
import EditBudgetModal from "./EditBudgetModal";

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
  const [modalVisible, setModalVisible] = useState(false);

  const meta = CATEGORY_META[category];
  const pct =
    capCents > 0 ? Math.min(Math.max(spentCents / capCents, 0), 1) : 0;
  const overspent = spentCents > capCents;
  const barColor = overspent ? colors.danger : meta.color;

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        style={styles.card}
      >
        {/* Top row: emoji + info */}
        <View style={styles.topRow}>
          <View
            style={[styles.emojiBox, { backgroundColor: meta.color + "22" }]}
          >
            <Text style={styles.emoji}>{meta.emoji}</Text>
          </View>

          <View style={styles.info}>
            {/* Name + amounts on same line */}
            <View style={styles.nameRow}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text>
                <Text style={styles.spentAmount}>{formatVND(spentCents)}</Text>
                <Text
                  style={styles.capAmount}
                >{` / ${formatVND(capCents)}`}</Text>
              </Text>
            </View>
            {/* Remaining / overspent */}
            <Text style={[styles.remaining, overspent && styles.remainingOver]}>
              {overspent
                ? `${t.budget.overspent} ${formatVND(spentCents - capCents)}`
                : `${t.budget.budgetLeft} ${formatVND(capCents - spentCents)}`}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              { width: `${pct * 100}%` as any, backgroundColor: barColor },
            ]}
          />
        </View>
      </TouchableOpacity>
      <EditBudgetModal
        visible={modalVisible}
        category={category}
        spentCents={spentCents}
        capCents={capCents}
        onSave={onUpdateCap}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.cardBg,
      borderRadius: 20,
      paddingTop: 14,
      paddingHorizontal: 16,
      paddingBottom: 14,
      gap: 10,
      shadowColor: "#281910",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    emojiBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    emoji: {
      fontSize: 22,
    },
    info: {
      flex: 1,
      gap: 2,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    categoryName: {
      fontFamily: FontNames.bodySemi,
      fontSize: 15,
      color: c.inkTextPrimary,
    },
    spentAmount: {
      fontFamily: FontNames.amount,
      fontSize: 13,
      color: c.inkTextPrimary,
    },
    capAmount: {
      fontFamily: FontNames.amountReg,
      fontSize: 13,
      color: c.inkTextSecondary,
    },
    remaining: {
      fontFamily: FontNames.body,
      fontSize: 12,
      color: c.inkTextSecondary,
    },
    remainingOver: {
      color: c.danger,
    },
    barBg: {
      height: 8,
      borderRadius: 4,
      backgroundColor: c.ink2,
      overflow: "hidden",
    },
    barFill: {
      height: 8,
      borderRadius: 4,
    },
  });
}
