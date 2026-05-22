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
  ink0: '#EEF4F9',
  ink1: '#E0EAF2',
  ink2: '#D0D8E0',
  ink3: '#C8D5DF',
  ink4: '#A5B0BA',
  inkTextPrimary: '#14202A',
  inkTextSecondary: '#5C6A75',
  inkTextTertiary: '#A5B0BA',
  orange: '#4E83B5',
  orangeMuted: '#7FB2DB',
  orangeDeep: '#2F5F8C',
  success: '#2F8769',
  danger: '#D63B2F',
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',
  budgetHeroStart: '#0D1420',
  budgetHeroEnd: '#162840',
  streakStart: '#AFD4F0',
  streakEnd: '#2F5F8C',
  navBlurTint: 'light' as const,
  navTopBorder: 'rgba(20,32,42,0.08)',
  cardBg: '#FFFFFF',
};

export const DarkColors = {
  ink0: '#0D1420',
  ink1: '#162030',
  ink2: '#1E2A3C',
  ink3: '#253548',
  ink4: '#3A5068',
  inkTextPrimary: '#EDF3F8',
  inkTextSecondary: '#A5B0BA',
  inkTextTertiary: '#6A7A8A',
  orange: '#4E83B5',
  orangeMuted: '#7FB2DB',
  orangeDeep: '#2F5F8C',
  success: '#3FAF89',
  danger: '#E85550',
  camBg: '#0D0D0D',
  camGlass: 'rgba(255,255,255,0.10)',
  budgetHeroStart: '#0D1420',
  budgetHeroEnd: '#162840',
  streakStart: '#AFD4F0',
  streakEnd: '#2F5F8C',
  navBlurTint: 'dark' as const,
  navTopBorder: 'rgba(255,255,255,0.08)',
  cardBg: '#162030',
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
