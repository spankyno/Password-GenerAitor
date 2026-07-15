import { Link } from 'react-router-dom';
import { useTranslation } from '@/context/LocaleContext';

const EXTERNAL_LINKS = [
  { key: 'footerContact', href: 'https://aitor-blog-contacto.vercel.app/' },
  { key: 'footerBlog', href: 'https://aitorsanchez.pages.dev/' },
  { key: 'footerMoreApps', href: 'https://aitorhub.vercel.app/' },
] as const;

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-4 flex flex-col items-center gap-3 border-t border-[var(--color-border)] pt-6 text-center">
      <nav
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--color-text-secondary)]"
        aria-label="Enlaces del sitio"
      >
        <Link to="/acerca-de" className="transition-colors hover:text-[var(--color-text-primary)]">
          {t('footerAbout')}
        </Link>
        {EXTERNAL_LINKS.map((link) => (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--color-text-primary)]"
          >
            {t(link.key)}
          </a>
        ))}
      </nav>
      <p className="text-[11px] text-[var(--color-text-secondary)]">{t('footerCopyright')}</p>
    </footer>
  );
}
