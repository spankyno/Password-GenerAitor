import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Locale, type TranslationKey } from '@/lib/i18n/translations';

const STORAGE_KEY = 'pwgen:locale:v1';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored;
  } catch {
    // localStorage inaccesible: seguimos con la preferencia del navegador.
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en')) {
    return 'en';
  }
  return 'es';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Cuota excedida o localStorage bloqueado: el idioma sigue funcionando en memoria.
    }
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let text: string = translations[locale][key] ?? translations.es[key] ?? key;
    if (vars) {
      for (const [varKey, value] of Object.entries(vars)) {
        text = text.replace(`{${varKey}}`, String(value));
      }
    }
    return text;
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useTranslation debe usarse dentro de <LocaleProvider>');
  return ctx;
}
