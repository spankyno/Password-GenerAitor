import { cn } from '@/lib/utils';
import { BULK_COUNT_OPTIONS, type BulkCount } from '@/hooks/useBulkGeneration';

interface BulkCountSelectorProps {
  activeCount: BulkCount | null;
  onSelect: (count: BulkCount) => void;
}

export function BulkCountSelector({ activeCount, onSelect }: BulkCountSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Cantidad de contraseñas a generar">
      {BULK_COUNT_OPTIONS.map((count) => (
        <button
          key={count}
          type="button"
          onClick={() => onSelect(count)}
          aria-pressed={activeCount === count}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
            activeCount === count
              ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
              : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {count}
        </button>
      ))}
    </div>
  );
}
