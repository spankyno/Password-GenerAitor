import {
  ShieldCheck,
  Gauge,
  Table2,
  KeySquare,
  Hash,
  FolderOpen,
  WifiOff,
  Languages,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/context/LocaleContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';

const TOOLS = [
  { icon: Sparkles, key: 'generator' },
  { icon: Gauge, key: 'strength' },
  { icon: Table2, key: 'bulk' },
  { icon: Hash, key: 'pin' },
  { icon: KeySquare, key: 'apikey' },
  { icon: FolderOpen, key: 'profiles' },
  { icon: WifiOff, key: 'pwa' },
  { icon: Languages, key: 'i18n' },
] as const;

const TOOL_LABELS: Record<(typeof TOOLS)[number]['key'], { es: string; en: string; desc: { es: string; en: string } }> = {
  generator: {
    es: 'Generador principal',
    en: 'Main generator',
    desc: {
      es: 'Longitud, tipos de carácter, mínimos y exclusiones, todo reactivo e instantáneo.',
      en: 'Length, character types, minimums and exclusions — all reactive and instant.',
    },
  },
  strength: {
    es: 'Panel de fortaleza',
    en: 'Strength panel',
    desc: {
      es: 'Bits de entropía reales, tiempos de crackeo por escenario y explicación del porqué.',
      en: 'Real entropy bits, crack-time scenarios and a plain-language explanation.',
    },
  },
  bulk: {
    es: 'Generación múltiple',
    en: 'Bulk generation',
    desc: { es: 'Hasta 50 contraseñas a la vez, exportables a CSV, TXT o JSON.', en: 'Up to 50 passwords at once, exportable to CSV, TXT or JSON.' },
  },
  pin: {
    es: 'Generador de PIN',
    en: 'PIN generator',
    desc: { es: 'De 4 a 8 dígitos, evitando patrones y combinaciones débiles conocidas.', en: '4 to 8 digits, avoiding known weak patterns and combinations.' },
  },
  apikey: {
    es: 'API Key / Token',
    en: 'API Key / Token',
    desc: { es: 'Hex, Base64, Base58, UUID v4 o charset personalizado, longitud configurable.', en: 'Hex, Base64, Base58, UUID v4 or custom charset, configurable length.' },
  },
  profiles: {
    es: 'Perfiles y presets',
    en: 'Profiles and presets',
    desc: { es: 'Guarda configuraciones por sitio y aplica presets de un toque.', en: 'Save per-site configurations and apply one-tap presets.' },
  },
  pwa: {
    es: 'PWA offline',
    en: 'Offline PWA',
    desc: { es: 'Instalable en móvil y escritorio, funciona sin conexión.', en: 'Installable on mobile and desktop, works without a connection.' },
  },
  i18n: {
    es: 'Temas e idiomas',
    en: 'Themes and languages',
    desc: { es: 'Claro, oscuro y alto contraste; español e inglés.', en: 'Light, dark and high-contrast; Spanish and English.' },
  },
};

const STACK_BADGES = [
  'React 19',
  'TypeScript',
  'Vite',
  'Tailwind CSS v4',
  'Vitest',
  'vite-plugin-pwa',
  'Web Crypto API',
];

export function About() {
  const { t, locale } = useTranslation();

  usePageMeta({
    title: 'Acerca de — Password GenerAitor | Generador de Contraseñas Seguras',
    description:
      'Conoce Password GenerAitor: generador de contraseñas 100% local, sus herramientas (fortaleza, PIN, API Key, generación múltiple) y su stack tecnológico.',
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-6 sm:py-10">
      <AppHeader />

      <section className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <ShieldCheck size={22} />
        </span>
        <h1 className="text-2xl font-semibold leading-tight text-[var(--color-text-primary)] sm:text-3xl">
          {t('aboutTitle')}
        </h1>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
          {t('aboutIntro')}
        </p>
      </section>

      <section
        className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
        aria-labelledby="mission-heading"
      >
        <h2 id="mission-heading" className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-primary)]">
          <Lock size={16} className="text-[var(--color-accent)]" />
          {t('aboutMissionHeading')}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{t('aboutMissionBody')}</p>
      </section>

      <section aria-labelledby="tools-heading">
        <h2
          id="tools-heading"
          className="mb-3 text-base font-semibold text-[var(--color-text-primary)]"
        >
          {t('aboutToolsHeading')}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOLS.map(({ icon: Icon, key }) => {
            const label = TOOL_LABELS[key][locale];
            const desc = TOOL_LABELS[key].desc[locale];
            return (
              <div
                key={key}
                className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
        aria-labelledby="stack-heading"
      >
        <h2 id="stack-heading" className="text-base font-semibold text-[var(--color-text-primary)]">
          {t('aboutStackHeading')}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{t('aboutStackBody')}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {STACK_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section
        className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
        aria-labelledby="author-heading"
      >
        <h2 id="author-heading" className="text-base font-semibold text-[var(--color-text-primary)]">
          {t('aboutAuthorHeading')}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {t('aboutAuthorBody')}{' '}
          <a
            href="https://aitorsanchez.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] underline underline-offset-2"
          >
            aitorsanchez.pages.dev
          </a>
        </p>
      </section>

      <AppFooter />
    </div>
  );
}
