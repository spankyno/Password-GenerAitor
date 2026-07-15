import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LocaleContext';

interface PrivacyToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function PrivacyToggle({ enabled, onToggle }: PrivacyToggleProps) {
  const { t } = useTranslation();
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-control)] p-1">
      <span className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
        <ShieldAlert size={15} className="text-[var(--color-text-secondary)]" />
        {t('privacyModeLabel')}
        <span className="text-xs text-[var(--color-text-secondary)]">{t('privacyModeHint')}</span>
      </span>
      <span className="relative inline-flex h-5 w-9 flex-shrink-0 items-center">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="peer sr-only"
          aria-label="Activar modo privacidad"
        />
        <span
          className={cn(
            'h-5 w-9 rounded-full transition-colors',
            enabled ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
          )}
        />
        <span
          className={cn(
            'absolute left-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            enabled && 'translate-x-4'
          )}
        />
      </span>
    </label>
  );
}
