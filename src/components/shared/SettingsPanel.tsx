import { Contrast, Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/LocaleContext';
import type { Locale } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

const THEME_OPTIONS: Array<{ id: Theme; icon: React.ReactNode }> = [
  { id: 'light', icon: <Sun size={14} /> },
  { id: 'dark', icon: <Moon size={14} /> },
  { id: 'high-contrast', icon: <Contrast size={14} /> },
];

const LOCALE_OPTIONS: Array<{ id: Locale; label: string }> = [
  { id: 'es', label: 'ES' },
  { id: 'en', label: 'EN' },
];

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useTranslation();

  const themeLabels: Record<Theme, string> = {
    light: t('themeLight'),
    dark: t('themeDark'),
    'high-contrast': t('themeHighContrast'),
  };

  return (
    <section
      className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      aria-labelledby="settings-heading"
    >
      <h2 id="settings-heading" className="text-sm font-semibold text-[var(--color-text-primary)]">
        {t('settingsHeading')}
      </h2>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5" role="group" aria-label={t('themeLabel')}>
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTheme(option.id)}
              aria-pressed={theme === option.id}
              title={themeLabels[option.id]}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                theme === option.id
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
              )}
            >
              {option.icon}
              {themeLabels[option.id]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5" role="group" aria-label={t('languageLabel')}>
          {LOCALE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setLocale(option.id)}
              aria-pressed={locale === option.id}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                locale === option.id
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
