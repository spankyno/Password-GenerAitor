import type { StrengthLevel } from '@/types/password';
import { LEVEL_LABEL, LEVEL_COLOR, LEVEL_PERCENT } from '@/lib/strengthMessages';

interface StrengthLevelBarProps {
  level: StrengthLevel;
  entropyBits: number;
}

export function StrengthLevelBar({ level, entropyBits }: StrengthLevelBarProps) {
  const color = LEVEL_COLOR[level];
  const percent = LEVEL_PERCENT[level];

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-semibold" style={{ color }}>
          {LEVEL_LABEL[level]}
        </span>
        <span className="font-mono text-sm text-[var(--color-text-secondary)]">
          {entropyBits} bits de entropía
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Fortaleza: ${LEVEL_LABEL[level]}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
