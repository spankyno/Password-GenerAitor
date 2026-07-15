import { Info } from 'lucide-react';
import type { StrengthReasonCode } from '@/types/password';
import { reasonToText } from '@/lib/strengthMessages';

interface StrengthReasonsProps {
  reasons: StrengthReasonCode[];
}

export function StrengthReasons({ reasons }: StrengthReasonsProps) {
  if (reasons.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        Por qué
      </h3>
      <ul className="flex flex-col gap-1.5">
        {reasons.map((reason, i) => (
          <li
            key={`${reason.code}-${i}`}
            className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
          >
            <Info size={14} className="mt-0.5 flex-shrink-0 text-[var(--color-text-secondary)]" />
            <span>{reasonToText(reason)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
