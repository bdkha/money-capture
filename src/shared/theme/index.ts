import { Category } from '../types';

export const Colors = {
  // Page & surface
  ink0: '#EEF4F9',
  ink1: '#E0EAF2',
  ink2: '#D0D8E0',
  ink3: '#C8D5DF',
  ink4: '#A5B0BA',

  // Text
  inkTextPrimary: '#14202A',
  inkTextSecondary: '#5C6A75',
  inkTextTertiary: '#A5B0BA',

  // Accent
  orange: '#4E83B5',
  orangeMuted: '#7FB2DB',
  orangeDeep: '#2F5F8C',

  // Status
  success: '#2F8769',
  danger: '#D63B2F',

  // Camera screen (dark)
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',

  // Budget hero gradient
  budgetHeroStart: '#0D1420',
  budgetHeroEnd: '#162840',

  // Streak gradient
  streakStart: '#AFD4F0',
  streakEnd: '#2F5F8C',
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
