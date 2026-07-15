import type { StrengthResult } from '@/types/password';
import { StrengthLevelBar } from './StrengthLevelBar';
import { CrackTimeTable } from './CrackTimeTable';
import { StrengthReasons } from './StrengthReasons';

interface StrengthPanelProps {
  strength: StrengthResult;
}

export function StrengthPanel({ strength }: StrengthPanelProps) {
  return (
    <section
      className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6"
      aria-labelledby="strength-heading"
    >
      <h2 id="strength-heading" className="sr-only">
        Fortaleza de la contraseña
      </h2>
      <StrengthLevelBar level={strength.level} entropyBits={strength.entropyBits} />
      <CrackTimeTable scenarios={strength.scenarios} />
      <StrengthReasons reasons={strength.reasons} />
    </section>
  );
}
