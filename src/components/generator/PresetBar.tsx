import { QUICK_PRESETS } from '@/utils/presets';
import type { PasswordOptions } from '@/types/password';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LocaleContext';

interface PresetBarProps {
  onApply: (options: PasswordOptions) => void;
}

export function PresetBar({ onApply }: PresetBarProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        {t('presetsHeading')}
      </h2>
      <div className="flex flex-wrap gap-2">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApply(preset.options)}
            className={cn(
              'rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-xs font-medium',
              'text-[var(--color-text-secondary)] transition-colors',
              'hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
