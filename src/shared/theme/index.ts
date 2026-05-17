import { Category } from '../types';

export const Colors = {
  // Page & surface
  ink0: '#F0F7F4',
  ink1: '#E8F3EE',
  ink2: '#D8EDE4',
  ink3: '#C2DDD1',
  ink4: '#A0C4B4',

  // Text
  inkTextPrimary: '#1A1208',
  inkTextSecondary: '#7A6A58',
  inkTextTertiary: '#A0B4A8',

  // Accent (green pastel)
  orange: '#6FB88E',
  orangeMuted: '#9DD4B4',
  orangeDeep: '#5DA67D',

  // Status
  success: '#4A9E7B',
  danger: '#D63B2F',

  // Camera screen (dark)
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',

  // Budget hero gradient
  budgetHeroStart: '#0D1A12',
  budgetHeroEnd: '#162A1C',

  // Streak gradient
  streakStart: '#6FB88E',
  streakEnd: '#5DA67D',

  // Gold accent (new)
  gold: '#E8A93C',
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
