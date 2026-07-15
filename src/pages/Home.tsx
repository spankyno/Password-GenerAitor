import { useEffect, useState, lazy, Suspense } from 'react';
import { KeyRound } from 'lucide-react';
import { usePasswordOptions } from '@/hooks/usePasswordOptions';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { useClipboard } from '@/hooks/useClipboard';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LocaleContext';
import { LengthSlider } from '@/components/generator/LengthSlider';
import { OptionsPanel } from '@/components/generator/OptionsPanel';
import { MinimumsPanel } from '@/components/generator/MinimumsPanel';
import { PasswordDisplay } from '@/components/generator/PasswordDisplay';
import { StrengthPanel } from '@/components/strength/StrengthPanel';
import { TipBanner } from '@/components/education/TipBanner';
import { generateEducationalTips } from '@/utils/educationalTips';
import { PresetBar } from '@/components/generator/PresetBar';
import { PrivacyToggle } from '@/components/generator/PrivacyToggle';
import { usePrivacyMode } from '@/hooks/usePrivacyMode';

// Secciones fuera del viewport inicial: se cargan en chunks separados para
// reducir el JS que bloquea el hilo principal en la carga inicial (mejora
// directa del Total Blocking Time).
const ProfileManager = lazy(() =>
  import('@/components/profiles/ProfileManager').then((m) => ({ default: m.ProfileManager }))
);
const BulkPanel = lazy(() =>
  import('@/components/bulk/BulkPanel').then((m) => ({ default: m.BulkPanel }))
);
const SpecializedGenerators = lazy(() =>
  import('@/components/specialized/SpecializedGenerators').then((m) => ({
    default: m.SpecializedGenerators,
  }))
);
const SettingsPanel = lazy(() =>
  import('@/components/shared/SettingsPanel').then((m) => ({ default: m.SettingsPanel }))
);

function SectionFallback() {
  return (
    <div
      className="h-24 animate-pulse rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-hidden="true"
    />
  );
}

export function Home() {
  const { t } = useTranslation();
  const { options, dispatch } = usePasswordOptions();
  const { password, strength, warning, regenerate } = usePasswordGenerator(options);
  const { showToast } = useToast();
  const { copy, justCopied } = useClipboard({ autoClearSeconds: 0 });
  const [isFavorite, setIsFavorite] = useState(false);
  const [visible, setVisible] = useState(true);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const { blurred } = usePrivacyMode(privacyEnabled);

  // Al cambiar la contraseña (nueva generación), el estado de favorito es de
  // la nueva contraseña, no de la anterior.
  useEffect(() => {
    setIsFavorite(false);
  }, [password]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.code === 'Space' && !isTyping) {
        e.preventDefault();
        regenerate();
      } else if (e.key === 'Escape') {
        setVisible(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c' && !window.getSelection()?.toString()) {
        handleCopy();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        regenerate();
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  async function handleCopy() {
    await copy(password);
    showToast('Contraseña copiada al portapapeles');
  }

  const tips = generateEducationalTips(options, strength);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:py-10">
      <a href="#main-content" className="skip-link">
        {t('skipToContent')}
      </a>

      <header className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <KeyRound size={18} />
        </span>
        <div>
          <h1 className="text-lg font-semibold leading-tight">{t('appTitle')}</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">{t('appSubtitle')}</p>
        </div>
      </header>

      <main id="main-content" className="flex flex-col gap-6">
        <PasswordDisplay
          password={password}
          onRegenerate={regenerate}
          onCopy={handleCopy}
          justCopied={justCopied}
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite((v) => !v)}
          patterns={strength.patterns}
          visible={visible}
          onToggleVisible={() => setVisible((v) => !v)}
          blurred={blurred}
        />

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 sm:px-6">
          <PrivacyToggle enabled={privacyEnabled} onToggle={() => setPrivacyEnabled((v) => !v)} />
        </div>

        <PresetBar onApply={(presetOptions) => dispatch({ type: 'APPLY_PRESET', options: presetOptions })} />

        {warning === 'minimums-exceed-length' && (
          <p role="alert" className="text-xs text-[var(--color-warning)]">
            Los mínimos solicitados superan la longitud elegida; se ajustó la longitud para poder cumplirlos.
          </p>
        )}

        <StrengthPanel strength={strength} />

        <TipBanner tips={tips} />

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
          <LengthSlider
            value={options.length}
            onChange={(length) => dispatch({ type: 'SET_LENGTH', length })}
          />
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
          <OptionsPanel
            charset={options.charset}
            exclusions={options.exclusions}
            onToggleCharset={(key) => dispatch({ type: 'TOGGLE_CHARSET', key })}
            onToggleExclusion={(key) => dispatch({ type: 'TOGGLE_EXCLUSION', key })}
          />
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
          <MinimumsPanel
            minimums={options.minimums}
            onChange={(key, value) => dispatch({ type: 'SET_MINIMUM', key, value })}
          />
        </div>

        <Suspense fallback={<SectionFallback />}>
          <ProfileManager
            currentOptions={options}
            onApplyProfile={(profileOptions) => dispatch({ type: 'APPLY_PRESET', options: profileOptions })}
          />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <BulkPanel options={options} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <SpecializedGenerators />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <SettingsPanel />
        </Suspense>
      </main>
    </div>
  );
}
