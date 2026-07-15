import { useMemo, useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { generatePin, PIN_MAX_LENGTH, PIN_MIN_LENGTH } from '@/utils/pinGenerator';
import { useClipboard } from '@/hooks/useClipboard';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

export function PinGenerator() {
  const [length, setLength] = useState(6);
  const [nonce, setNonce] = useState(0);
  const { copy, justCopied } = useClipboard({ autoClearSeconds: 0 });
  const { showToast } = useToast();

  const { pin } = useMemo(() => generatePin(length), [length, nonce]);

  async function handleCopy() {
    await copy(pin);
    showToast('PIN copiado');
  }

  const lengthOptions = Array.from(
    { length: PIN_MAX_LENGTH - PIN_MIN_LENGTH + 1 },
    (_, i) => PIN_MIN_LENGTH + i
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[var(--color-surface-elevated)] py-6">
        <output aria-live="polite" className="font-mono text-3xl font-semibold tracking-[0.3em] text-[var(--color-text-primary)]">
          {pin}
        </output>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Longitud del PIN">
        {lengthOptions.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setLength(n)}
            aria-pressed={length === n}
            className={cn(
              'h-8 w-8 rounded-full border text-sm font-medium transition-colors',
              length === n
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]"
        >
          <RefreshCw size={15} /> Regenerar
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
            justCopied
              ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
              : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {justCopied ? <Check size={15} /> : <Copy size={15} />} {justCopied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}
