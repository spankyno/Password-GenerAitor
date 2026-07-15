import { KeyRound, Info, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/context/LocaleContext';

export function AppHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const isAbout = location.pathname === '/acerca-de';

  return (
    <header className="flex items-center justify-between gap-2.5">
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <KeyRound size={18} />
        </span>
        <div>
          <h1 className="text-lg font-semibold leading-tight text-[var(--color-text-primary)]">
            {t('appTitle')}
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)]">{t('appSubtitle')}</p>
        </div>
      </Link>

      {isAbout ? (
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft size={14} />
          {t('navHome')}
        </Link>
      ) : (
        <Link
          to="/acerca-de"
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]"
        >
          <Info size={14} />
          {t('navAbout')}
        </Link>
      )}
    </header>
  );
}
