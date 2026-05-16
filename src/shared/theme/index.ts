import { Category } from '../types';

export const Colors = {
  // Page & surface
  ink0: '#FBF6EE',
  ink1: '#F3EDE3',
  ink2: '#E8DFD2',
  ink3: '#D4C9B8',
  ink4: '#B8A898',

  // Text
  inkTextPrimary: '#1A1208',
  inkTextSecondary: '#7A6A58',
  inkTextTertiary: '#A89880',

  // Accent
  orange: '#FF6B35',
  orangeMuted: '#FF9A70',
  orangeDeep: '#E8521A',

  // Status
  success: '#2F8769',
  danger: '#D63B2F',

  // Camera screen (dark)
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',

  // Budget hero gradient
  budgetHeroStart: '#1A1410',
  budgetHeroEnd: '#2A2018',

  // Streak gradient
  streakStart: '#FF6B35',
  streakEnd: '#E8521A',
};

export const CATEGORY_META: Record<Category, { color: string; emoji: string }> = {
  'Cafe':     { color: '#A87248', emoji: '☕' },
  'Ăn uống':  { color: '#D86B2C', emoji: '🍜' },
  'Mua sắm':  { color: '#B6498F', emoji: '🛍' },
  'Đi lại':   { color: '#4A78C8', emoji: '🚖' },
  'Vui chơi': { color: '#8854B0', emoji: '🎉' },
  'Nhà':      { color: '#2F8769', emoji: '🏠' },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radii = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const FontNames = {
  display:   'PlusJakartaSans_800ExtraBold',
  title:     'PlusJakartaSans_700Bold',
  subtitle:  'PlusJakartaSans_600SemiBold',
  body:      'Inter_400Regular',
  bodyMed:   'Inter_500Medium',
  bodySemi:  'Inter_600SemiBold',
  amount:    'JetBrainsMono_700Bold',
  amountMed: 'JetBrainsMono_500Medium',
  amountReg: 'JetBrainsMono_400Regular',
};

export const Typography = {
  display:   { fontFamily: FontNames.display,   fontSize: 36, letterSpacing: -0.5 },
  title:     { fontFamily: FontNames.title,     fontSize: 22 },
  subtitle:  { fontFamily: FontNames.subtitle,  fontSize: 18 },
  body:      { fontFamily: FontNames.body,      fontSize: 15, lineHeight: 22 },
  bodyBold:  { fontFamily: FontNames.bodySemi,  fontSize: 15 },
  caption:   { fontFamily: FontNames.body,      fontSize: 12, lineHeight: 17 },
  amount:    { fontFamily: FontNames.amount,    fontSize: 56 },
  amountSm:  { fontFamily: FontNames.amountMed, fontSize: 28 },
  amountXs:  { fontFamily: FontNames.amountReg, fontSize: 20 },
};
