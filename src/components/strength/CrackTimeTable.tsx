import { Cloud, Wifi, WifiOff } from 'lucide-react';
import type { CrackTimeScenario } from '@/types/password';
import { SCENARIO_LABEL } from '@/lib/strengthMessages';
import { cn } from '@/lib/utils';

interface CrackTimeTableProps {
  scenarios: CrackTimeScenario[];
}

export function CrackTimeTable({ scenarios }: CrackTimeTableProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        Tiempo estimado de crackeo
      </h3>
      <ul className="flex flex-col gap-1.5">
        {scenarios.map((scenario) => {
          const info = SCENARIO_LABEL[scenario.id] ?? { title: scenario.id, context: 'offline' as const };
          return (
            <li
              key={scenario.id}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2"
            >
              <span className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
                <ContextIcon context={info.context} />
                {info.title}
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-mono font-medium',
                  'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                )}
              >
                {scenario.formatted}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ContextIcon({ context }: { context: 'online' | 'offline' }) {
  if (context === 'online') {
    return <Wifi size={14} className="text-[var(--color-text-secondary)]" aria-label="En línea" />;
  }
  const isCluster = false;
  return isCluster ? (
    <Cloud size={14} className="text-[var(--color-text-secondary)]" aria-label="Offline" />
  ) : (
    <WifiOff size={14} className="text-[var(--color-text-secondary)]" aria-label="Sin conexión" />
  );
}
