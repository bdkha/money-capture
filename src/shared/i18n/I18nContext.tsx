import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language, Strings } from './translations';

const STORAGE_KEY = '@chopp:language';

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Strings;
}

const I18nContext = createContext<I18nContextValue>({
  language: 'vi',
  setLanguage: () => {},
  t: translations.vi,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'vi' || v === 'en') {
        setLanguageState(v);
      }
    });
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  }

  const value = useMemo(
    () => ({ language, setLanguage, t: translations[language] }),
    [language],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
