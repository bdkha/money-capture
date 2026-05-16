import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MonthlySummary, CATEGORIES } from '../../../shared/types';
import { Colors, CATEGORY_META, FontNames } from '../../../shared/theme';
import { formatVND } from '../../../shared/utils/currency';

interface DonutChartProps {
  summary: MonthlySummary;
  budgetCap?: number;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const p1 = polarToCartesian(cx, cy, outerR, endAngle);
  const p2 = polarToCartesian(cx, cy, outerR, startAngle);
  const p3 = polarToCartesian(cx, cy, innerR, startAngle);
  const p4 = polarToCartesian(cx, cy, innerR, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${outerR} ${outerR} 0 ${large} 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerR} ${innerR} 0 ${large} 1 ${p4.x} ${p4.y} Z`;
}

const CX = 80;
const CY = 80;
const OUTER_R = 70;
const INNER_R = 48;
const GAP_DEG = 2; // 1 degree gap on each side of each segment

export default function DonutChart({ summary }: DonutChartProps) {
  const { totalCents, byCategory } = summary;

  const activeCategories = CATEGORIES.filter((cat) => byCategory[cat] > 0);

  const segments = React.useMemo(() => {
    if (totalCents === 0 || activeCategories.length === 0) return [];

    return activeCategories.map((cat) => ({
      cat,
      fraction: byCategory[cat] / totalCents,
      color: CATEGORY_META[cat].color,
    }));
  }, [totalCents, activeCategories, byCategory]);

  // Empty state
  if (totalCents === 0 || segments.length === 0) {
    const emptyPath = arcPath(CX, CY, OUTER_R, INNER_R, 0, 359.9);
    return (
      <View style={styles.container}>
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <Path d={emptyPath} fill={Colors.ink3} />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.amountText}>0đ</Text>
          <Text style={styles.subText}>đã chi</Text>
        </View>
      </View>
    );
  }

  // Calculate arc angles with gaps
  let currentAngle = 0;
  const paths: { d: string; color: string; key: string }[] = [];

  segments.forEach((seg) => {
    const totalSweep = seg.fraction * 360;

    let startAngle: number;
    let endAngle: number;

    if (segments.length === 1) {
      // Only one category: draw nearly full circle, no gap needed
      startAngle = 0;
      endAngle = 359.9;
    } else {
      // Add 1 degree gap on each side
      startAngle = currentAngle + GAP_DEG / 2;
      endAngle = currentAngle + totalSweep - GAP_DEG / 2;
    }

    // Only draw if sweep is meaningful
    if (endAngle > startAngle) {
      const d = arcPath(CX, CY, OUTER_R, INNER_R, startAngle, endAngle);
      paths.push({ d, color: seg.color, key: seg.cat });
    }

    currentAngle += totalSweep;
  });

  return (
    <View style={styles.container}>
      <Svg width={160} height={160} viewBox="0 0 160 160">
        {paths.map((p) => (
          <Path key={p.key} d={p.d} fill={p.color} />
        ))}
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.amountText}>{formatVND(totalCents)}</Text>
        <Text style={styles.subText}>đã chi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
  },
  center: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontFamily: FontNames.amount,
    fontSize: 18,
    color: Colors.inkTextPrimary,
    textAlign: 'center',
  },
  subText: {
    fontFamily: FontNames.body,
    fontSize: 11,
    color: Colors.inkTextSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
