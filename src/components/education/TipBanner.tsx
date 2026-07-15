import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import type { Tip } from '@/utils/educationalTips';

interface TipBannerProps {
  tips: Tip[];
}

const ROTATE_INTERVAL_MS = 7000;

export function TipBanner({ tips }: TipBannerProps) {
  const [index, setIndex] = useState(0);

  // Si cambia la lista de consejos (por un cambio de configuración),
  // volvemos a empezar por el más relevante en vez de dejar un índice
  // fuera de rango.
  useEffect(() => {
    setIndex(0);
  }, [tips]);

  useEffect(() => {
    if (tips.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % tips.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [tips.length]);

  const currentTip = tips[index];
  if (!currentTip) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      role="note"
      aria-label="Consejo educativo"
    >
      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
        <Lightbulb size={14} />
      </span>
      <p key={currentTip.id} className="text-sm leading-relaxed text-[var(--color-text-secondary)] motion-safe:[animation:tip-fade-in_250ms_ease-out]">
        {currentTip.text}
      </p>
      {tips.length > 1 && (
        <div className="ml-auto flex flex-shrink-0 gap-1 pt-1.5" aria-hidden="true">
          {tips.map((tip, i) => (
            <span
              key={tip.id}
              className="h-1 w-1 rounded-full transition-colors"
              style={{
                backgroundColor: i === index ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
