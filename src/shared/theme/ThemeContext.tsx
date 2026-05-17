import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LightColors = {
  ink0: '#F0F7F4',
  ink1: '#E8F3EE',
  ink2: '#D8EDE4',
  ink3: '#C2DDD1',
  ink4: '#A0C4B4',
  inkTextPrimary: '#1A1208',
  inkTextSecondary: '#7A6A58',
  inkTextTertiary: '#A0B4A8',
  orange: '#6FB88E',
  orangeMuted: '#9DD4B4',
  orangeDeep: '#5DA67D',
  success: '#4A9E7B',
  danger: '#D63B2F',
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',
  budgetHeroStart: '#0D1A12',
  budgetHeroEnd: '#162A1C',
  streakStart: '#6FB88E',
  streakEnd: '#5DA67D',
  navBlurTint: 'light' as const,
  navTopBorder: 'rgba(26,20,16,0.08)',
  cardBg: '#FFFFFF',
  gold: '#E8A93C',
};

export const DarkColors = {
  ink0: '#0A120E',
  ink1: '#101F15',
  ink2: '#182E20',
  ink3: '#264034',
  ink4: '#3D5A4A',
  inkTextPrimary: '#F5EFE6',
  inkTextSecondary: '#A8BEB4',
  inkTextTertiary: '#7A9A8A',
  orange: '#6FB88E',
  orangeMuted: '#9DD4B4',
  orangeDeep: '#5DA67D',
  success: '#4A9E7B',
  danger: '#E85550',
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',
  budgetHeroStart: '#0D1A12',
  budgetHeroEnd: '#162A1C',
  streakStart: '#6FB88E',
  streakEnd: '#5DA67D',
  navBlurTint: 'dark' as const,
  navTopBorder: 'rgba(255,255,255,0.08)',
  cardBg: '#101F15',
  gold: '#E8A93C',
};

export type ColorTokens = Omit<typeof LightColors, 'navBlurTint'> & { navBlurTint: 'light' | 'dark' };
export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = '@chopp:theme';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: ColorTokens;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  setMode: () => {},
  isDark: false,
  colors: LightColors,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') {
        setModeState(v);
      }
    });
  }, []);

  function setMode(m: ThemeMode) {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m);
  }

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? DarkColors : LightColors;

  const value = useMemo(
    () => ({ mode, setMode, isDark, colors }),
    [mode, isDark, colors],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useColors(): ColorTokens {
  return useContext(ThemeContext).colors;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
