import { Check, Copy, Star } from 'lucide-react';
import { useState } from 'react';
import type { GeneratedPassword } from '@/types/password';
import { LEVEL_COLOR, LEVEL_LABEL } from '@/lib/strengthMessages';
import { cn } from '@/lib/utils';

interface BulkTableProps {
  items: GeneratedPassword[];
  onToggleFavorite: (id: string) => void;
  onCopy: (value: string) => void;
}

export function BulkTable({ items, onToggleFavorite, onCopy }: BulkTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(item: GeneratedPassword) {
    onCopy(item.value);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 1500);
  }

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-border)]">
      <div className="max-h-[26rem] overflow-y-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-[var(--color-surface-elevated)] text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Contraseña</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">Fortaleza</th>
              <th className="px-3 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="border-t border-[var(--color-border)]">
                <td className="px-3 py-2 font-mono text-xs text-[var(--color-text-secondary)]">
                  {i + 1}
                </td>
                <td className="max-w-0 px-3 py-2">
                  <span className="block truncate font-mono text-sm text-[var(--color-text-primary)]">
                    {item.value}
                  </span>
                </td>
                <td className="hidden px-3 py-2 sm:table-cell">
                  <span
                    className="text-xs font-medium"
                    style={{ color: LEVEL_COLOR[item.strength.level] }}
                  >
                    {LEVEL_LABEL[item.strength.level]}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      aria-label="Copiar esta contraseña"
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                        copiedId === item.id
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]'
                      )}
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      aria-label={item.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
                      aria-pressed={item.isFavorite}
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                        item.isFavorite
                          ? 'text-[var(--color-accent)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]'
                      )}
                    >
                      <Star size={14} className={item.isFavorite ? 'fill-current' : ''} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
