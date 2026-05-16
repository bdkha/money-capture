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
  ink0: '#FBF6EE',
  ink1: '#F3EDE3',
  ink2: '#E8DFD2',
  ink3: '#D4C9B8',
  ink4: '#B8A898',
  inkTextPrimary: '#1A1208',
  inkTextSecondary: '#7A6A58',
  inkTextTertiary: '#A89880',
  orange: '#FF6B35',
  orangeMuted: '#FF9A70',
  orangeDeep: '#E8521A',
  success: '#2F8769',
  danger: '#D63B2F',
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',
  budgetHeroStart: '#1A1410',
  budgetHeroEnd: '#2A2018',
  streakStart: '#FF6B35',
  streakEnd: '#E8521A',
  navBlurTint: 'light' as const,
  navTopBorder: 'rgba(26,20,8,0.08)',
  cardBg: '#FFFFFF',
};

export const DarkColors = {
  ink0: '#111008',
  ink1: '#1E1A10',
  ink2: '#2E2818',
  ink3: '#4A4030',
  ink4: '#6A5A48',
  inkTextPrimary: '#F5EFE6',
  inkTextSecondary: '#B8A898',
  inkTextTertiary: '#8A7A68',
  orange: '#FF6B35',
  orangeMuted: '#FF9A70',
  orangeDeep: '#E8521A',
  success: '#3FAF89',
  danger: '#E85550',
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',
  budgetHeroStart: '#1A1410',
  budgetHeroEnd: '#2A2018',
  streakStart: '#FF6B35',
  streakEnd: '#E8521A',
  navBlurTint: 'dark' as const,
  navTopBorder: 'rgba(255,255,255,0.08)',
  cardBg: '#1E1A10',
};

export type ColorTokens = typeof LightColors;
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
