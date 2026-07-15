import { getComposition } from '@/utils/passwordBuilder';

interface CompositionIndicatorProps {
  password: string;
}

const CATEGORIES: Array<{ key: keyof ReturnType<typeof getComposition>; label: string; color: string }> = [
  { key: 'uppercase', label: 'A-Z', color: '#f4f5f7' },
  { key: 'lowercase', label: 'a-z', color: '#9a9ba5' },
  { key: 'numbers', label: '0-9', color: '#60a5fa' },
  { key: 'symbols', label: '!@#', color: '#f59e0b' },
];

export function CompositionIndicator({ password }: CompositionIndicatorProps) {
  const composition = getComposition(password);
  const total = password.length || 1;

  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <div className="flex h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
        {CATEGORIES.map(({ key, color }) => {
          const width = (composition[key] / total) * 100;
          if (width === 0) return null;
          return (
            <span
              key={key}
              style={{ width: `${width}%`, backgroundColor: color }}
              className="h-full transition-all duration-200"
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {CATEGORIES.map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {label}: <span className="font-mono text-[var(--color-text-primary)]">{composition[key]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
