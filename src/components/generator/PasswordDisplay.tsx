import { useState } from 'react';
import { Check, Copy, Eye, EyeOff, RefreshCw, Share2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categorizeChar } from '@/utils/charsets';
import type { DetectedPattern } from '@/types/password';
import { CompositionIndicator } from './CompositionIndicator';
import { useTranslation } from '@/context/LocaleContext';

interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
  onCopy: () => void;
  justCopied: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  patterns?: DetectedPattern[];
  visible: boolean;
  onToggleVisible: () => void;
  blurred?: boolean;
}

const CATEGORY_COLOR: Record<string, string> = {
  uppercase: 'text-[var(--color-text-primary)]',
  lowercase: 'text-[var(--color-text-primary)]',
  numbers: 'text-[#60a5fa]',
  symbols: 'text-[#f59e0b]',
};

const PATTERN_TYPE_LABEL: Record<string, string> = {
  sequence: 'Secuencia',
  'keyboard-pattern': 'Patrón de teclado',
  repetition: 'Repetición',
  'common-word': 'Palabra frecuente',
  'common-name': 'Nombre común',
  year: 'Año',
  date: 'Fecha',
};

export function PasswordDisplay({
  password,
  onRegenerate,
  onCopy,
  justCopied,
  isFavorite,
  onToggleFavorite,
  patterns = [],
  visible,
  onToggleVisible,
  blurred = false,
}: PasswordDisplayProps) {
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const { t } = useTranslation();

  const flaggedIndices = new Map<number, string>();
  for (const pattern of patterns) {
    for (let i = pattern.index; i < pattern.index + pattern.match.length; i++) {
      flaggedIndices.set(i, PATTERN_TYPE_LABEL[pattern.type] ?? 'Patrón detectado');
    }
  }

  const handleShare = async () => {
    if (!canShare || !password) return;
    try {
      await navigator.share({ text: password });
    } catch {
      // El usuario canceló el share sheet o no está soportado; no hacemos nada más.
    }
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
      <div
        className={cn(
          'mb-4 flex min-h-[4rem] flex-wrap items-center justify-center gap-x-0.5 gap-y-1',
          'rounded-[var(--radius-control)] bg-[var(--color-surface-elevated)] px-3 py-4 sm:px-4',
          'transition-[filter] duration-300',
          blurred && visible && 'blur-md'
        )}
        role="group"
        aria-label="Contraseña generada"
      >
        {!visible ? (
          <span className="select-none font-mono text-2xl tracking-widest text-[var(--color-text-secondary)]">
            {'•'.repeat(Math.min(password.length || 20, 32))}
          </span>
        ) : (
          <output
            aria-live="polite"
            className="break-all font-mono text-xl font-medium sm:text-2xl"
          >
            {password.split('').map((ch, i) => {
              const flaggedLabel = flaggedIndices.get(i);
              const isDuplicateHighlight = hoveredChar !== null && ch === hoveredChar;
              return (
                <span
                  key={i}
                  title={flaggedLabel ? `${categorizeLabel(ch)} · ${flaggedLabel}` : categorizeLabel(ch)}
                  onMouseEnter={() => setHoveredChar(ch)}
                  onMouseLeave={() => setHoveredChar(null)}
                  className={cn(
                    CATEGORY_COLOR[categorizeChar(ch)] ?? 'text-[var(--color-text-primary)]',
                    'rounded transition-colors',
                    flaggedLabel &&
                      'underline decoration-[var(--color-danger)] decoration-2 decoration-dotted underline-offset-4',
                    isDuplicateHighlight && 'bg-[var(--color-accent-soft)]'
                  )}
                >
                  {ch}
                </span>
              );
            })}
          </output>
        )}
      </div>

      {patterns.length > 0 && visible && (
        <p className="mb-3 -mt-2 text-center text-xs text-[var(--color-danger)]">
          {patterns.length === 1
            ? t('patternsDetectedOne')
            : t('patternsDetectedMany', { count: patterns.length })}
        </p>
      )}

      {visible && (
        <div className="mb-4">
          <CompositionIndicator password={password} />
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:flex sm:justify-center sm:gap-3">
        <ActionButton
          label={t('actionRegenerate')}
          shortcut="Espacio"
          icon={<RefreshCw size={18} />}
          onClick={onRegenerate}
        />
        <ActionButton
          label={justCopied ? t('actionCopied') : t('actionCopy')}
          shortcut="Ctrl+C"
          icon={justCopied ? <Check size={18} /> : <Copy size={18} />}
          onClick={onCopy}
          active={justCopied}
        />
        <ActionButton
          label={isFavorite ? t('actionFavorited') : t('actionFavorite')}
          icon={<Star size={18} className={isFavorite ? 'fill-current' : ''} />}
          onClick={onToggleFavorite}
          active={isFavorite}
        />
        {canShare && (
          <ActionButton label={t('actionShare')} icon={<Share2 size={18} />} onClick={handleShare} />
        )}
        <ActionButton
          label={visible ? t('actionHide') : t('actionShow')}
          shortcut="Esc"
          icon={visible ? <EyeOff size={18} /> : <Eye size={18} />}
          onClick={onToggleVisible}
          className={canShare ? '' : 'col-span-1'}
        />
      </div>
    </div>
  );
}

function categorizeLabel(ch: string): string {
  const category = categorizeChar(ch);
  const labels: Record<string, string> = {
    uppercase: 'Mayúscula',
    lowercase: 'Minúscula',
    numbers: 'Número',
    symbols: 'Símbolo',
  };
  return labels[category] ?? '';
}

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  shortcut?: string;
  className?: string;
}

function ActionButton({ label, icon, onClick, active, shortcut, className }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-pressed={active}
      className={cn(
        'flex flex-col items-center gap-1 rounded-[var(--radius-control)] border px-2 py-2.5 text-xs font-medium',
        'transition-all active:scale-95',
        active
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]',
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
