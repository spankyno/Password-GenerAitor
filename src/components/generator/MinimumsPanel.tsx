import { Minus, Plus } from 'lucide-react';
import type { MinimumRequirements } from '@/types/password';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LocaleContext';
import type { TranslationKey } from '@/lib/i18n/translations';

interface MinimumsPanelProps {
  minimums: MinimumRequirements;
  onChange: (key: keyof MinimumRequirements, value: number) => void;
}

const FIELDS: Array<{ key: keyof MinimumRequirements; labelKey: TranslationKey }> = [
  { key: 'minUppercase', labelKey: 'minUppercase' },
  { key: 'minLowercase', labelKey: 'minLowercase' },
  { key: 'minNumbers', labelKey: 'minNumbers' },
  { key: 'minSymbols', labelKey: 'minSymbols' },
];

export function MinimumsPanel({ minimums, onChange }: MinimumsPanelProps) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="minimums-heading">
      <h2
        id="minimums-heading"
        className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]"
      >
        {t('minimumsHeading')}
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FIELDS.map(({ key, labelKey }) => {
          const label = t(labelKey);
          return (
            <div
              key={key}
              className="flex flex-col gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5"
            >
              <span className="text-[11px] text-[var(--color-text-secondary)]">{label}</span>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  aria-label={`- ${label}`}
                  onClick={() => onChange(key, Math.max(0, minimums[key] - 1))}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)]',
                    'text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-elevated)]'
                  )}
                >
                  <Minus size={14} />
                </button>
                <span className="font-mono text-lg tabular-nums text-[var(--color-text-primary)]">
                  {minimums[key]}
                </span>
                <button
                  type="button"
                  aria-label={`+ ${label}`}
                  onClick={() => onChange(key, minimums[key] + 1)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)]',
                    'text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-elevated)]'
                  )}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
