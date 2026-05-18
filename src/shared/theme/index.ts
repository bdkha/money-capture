import { Category } from '../types';

export const Colors = {
  // Page & surface
  ink0: '#F1F5EC',
  ink1: '#E7EEDD',
  ink2: '#D5E0CC',
  ink3: '#D0D8CC',
  ink4: '#A5B0A7',

  // Text
  inkTextPrimary: '#14201A',
  inkTextSecondary: '#5C6A60',
  inkTextTertiary: '#A5B0A7',

  // Accent
  orange: '#4E8C5C',
  orangeMuted: '#7FB77E',
  orangeDeep: '#2F6A3F',

  // Status
  success: '#2F8769',
  danger: '#D63B2F',

  // Camera screen (dark)
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',

  // Budget hero gradient
  budgetHeroStart: '#0D1A10',
  budgetHeroEnd: '#162818',

  // Streak gradient
  streakStart: '#B8DCA8',
  streakEnd: '#2F6A3F',
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
