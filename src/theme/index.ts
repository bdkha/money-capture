import { Category } from '../types';

export const Colors = {
  background: '#0A0A0A',
  surface: '#1A1A1A',
  surfaceHigh: '#2A2A2A',
  accent: '#F5C542',
  accentMuted: '#8A7A2A',
  text: '#FFFFFF',
  textSecondary: '#9A9A9A',
  border: '#2E2E2E',
  danger: '#FF4444',

  categories: {
    Food: '#FF6B6B',
    Transport: '#4ECDC4',
    Shopping: '#A78BFA',
    Bills: '#F59E0B',
    Entertainment: '#EC4899',
    Health: '#10B981',
    Other: '#6B7280',
  } as Record<Category, string>,
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
  full: 9999,
};

export const Typography = {
  hero: { fontSize: 36, fontWeight: '700' as const },
  title: { fontSize: 22, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  amount: { fontSize: 48, fontWeight: '800' as const },
};
