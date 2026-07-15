import type { PasswordOptions } from '@/types/password';
import { useBulkGeneration } from '@/hooks/useBulkGeneration';
import { BulkCountSelector } from './BulkCountSelector';
import { BulkTable } from './BulkTable';
import { ExportMenu } from './ExportMenu';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LocaleContext';

interface BulkPanelProps {
  options: PasswordOptions;
}

export function BulkPanel({ options }: BulkPanelProps) {
  const { items, lastCount, generate, toggleFavorite } = useBulkGeneration(options);
  const { showToast } = useToast();
  const { t } = useTranslation();

  async function handleCopy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // silencioso: el botón de la fila ya da feedback visual con el icono de check
    }
    showToast(t('actionCopied'));
  }

  return (
    <section
      className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6"
      aria-labelledby="bulk-heading"
    >
      <div className="flex items-center justify-between">
        <h2 id="bulk-heading" className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t('bulkHeading')}
        </h2>
        {items.length > 0 && <ExportMenu items={items} />}
      </div>

      <BulkCountSelector activeCount={lastCount} onSelect={generate} />

      <BulkTable items={items} onToggleFavorite={toggleFavorite} onCopy={handleCopy} />

      {items.length === 0 && (
        <p className="text-xs text-[var(--color-text-secondary)]">{t('bulkEmptyHint')}</p>
      )}
    </section>
  );
}
