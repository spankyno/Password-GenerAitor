import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxRow({ id, label, description, checked, onChange }: CheckboxRowProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-[var(--radius-control)] p-2.5',
        'transition-colors hover:bg-[var(--color-surface-elevated)]'
      )}
    >
      <span className="relative mt-0.5 flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-md border transition-all',
            'border-[var(--color-border)] bg-[var(--color-surface)]',
            'peer-checked:border-[var(--color-accent)] peer-checked:bg-[var(--color-accent)]',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-accent)] peer-focus-visible:outline-offset-2'
          )}
        >
          {checked && <Check size={13} strokeWidth={3} className="text-white" />}
        </span>
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
        {description && (
          <span className="text-xs text-[var(--color-text-secondary)]">{description}</span>
        )}
      </span>
    </label>
  );
}
