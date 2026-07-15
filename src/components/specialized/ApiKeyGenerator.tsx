import { useMemo, useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import {
  API_KEY_DEFAULT_LENGTH,
  API_KEY_MAX_LENGTH,
  API_KEY_MIN_LENGTH,
  API_KEY_FORMAT_LABEL,
  generateApiKey,
  type ApiKeyFormat,
} from '@/utils/apiKeyGenerator';
import { useClipboard } from '@/hooks/useClipboard';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const FORMATS: ApiKeyFormat[] = ['hex', 'base64', 'base58', 'uuid', 'custom'];

export function ApiKeyGenerator() {
  const [format, setFormat] = useState<ApiKeyFormat>('hex');
  const [length, setLength] = useState(API_KEY_DEFAULT_LENGTH);
  const [customCharset, setCustomCharset] = useState('');
  const [nonce, setNonce] = useState(0);
  const { copy, justCopied } = useClipboard({ autoClearSeconds: 0 });
  const { showToast } = useToast();

  const key = useMemo(
    () => generateApiKey({ format, length, customCharset }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [format, length, customCharset, nonce]
  );

  async function handleCopy() {
    await copy(key);
    showToast('Clave copiada');
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-[3.5rem] items-center justify-center rounded-[var(--radius-control)] bg-[var(--color-surface-elevated)] px-3 py-4">
        <output aria-live="polite" className="break-all font-mono text-base font-medium text-[var(--color-text-primary)] sm:text-lg">
          {key}
        </output>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Formato de la clave">
        {FORMATS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormat(f)}
            aria-pressed={format === f}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              format === f
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
            )}
          >
            {API_KEY_FORMAT_LABEL[f]}
          </button>
        ))}
      </div>

      {format !== 'uuid' && (
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <label htmlFor="apikey-length" className="text-xs text-[var(--color-text-secondary)]">
              Longitud
            </label>
            <span className="font-mono text-sm text-[var(--color-text-primary)]">{length}</span>
          </div>
          <input
            id="apikey-length"
            type="range"
            min={API_KEY_MIN_LENGTH}
            max={API_KEY_MAX_LENGTH}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-border)] accent-[var(--color-accent)]"
          />
        </div>
      )}

      {format === 'custom' && (
        <div>
          <label htmlFor="custom-charset" className="mb-1 block text-xs text-[var(--color-text-secondary)]">
            Charset personalizado (vacío = alfanumérico)
          </label>
          <input
            id="custom-charset"
            type="text"
            value={customCharset}
            onChange={(e) => setCustomCharset(e.target.value)}
            placeholder="ABCDEFabcdef0123456789"
            className="w-full rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-sm text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-accent)]"
          />
        </div>
      )}

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
