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
  ink0: '#F1F5EC',
  ink1: '#E7EEDD',
  ink2: '#D5E0CC',
  ink3: '#D0D8CC',
  ink4: '#A5B0A7',
  inkTextPrimary: '#14201A',
  inkTextSecondary: '#5C6A60',
  inkTextTertiary: '#A5B0A7',
  orange: '#4E8C5C',
  orangeMuted: '#7FB77E',
  orangeDeep: '#2F6A3F',
  success: '#2F8769',
  danger: '#D63B2F',
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',
  budgetHeroStart: '#0D1A10',
  budgetHeroEnd: '#162818',
  streakStart: '#B8DCA8',
  streakEnd: '#2F6A3F',
  navBlurTint: 'light' as const,
  navTopBorder: 'rgba(20,32,26,0.08)',
  cardBg: '#FFFFFF',
};

export const DarkColors = {
  ink0: '#0D1A10',
  ink1: '#162818',
  ink2: '#1E3822',
  ink3: '#2E5035',
  ink4: '#4A6850',
  inkTextPrimary: '#EDF5EE',
  inkTextSecondary: '#A5B0A7',
  inkTextTertiary: '#6A7A6C',
  orange: '#4E8C5C',
  orangeMuted: '#7FB77E',
  orangeDeep: '#2F6A3F',
  success: '#3FAF89',
  danger: '#E85550',
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',
  budgetHeroStart: '#0D1A10',
  budgetHeroEnd: '#162818',
  streakStart: '#B8DCA8',
  streakEnd: '#2F6A3F',
  navBlurTint: 'dark' as const,
  navTopBorder: 'rgba(255,255,255,0.08)',
  cardBg: '#162818',
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
