import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LocaleContext';
import { PinGenerator } from './PinGenerator';
import { ApiKeyGenerator } from './ApiKeyGenerator';

type Tab = 'pin' | 'apikey';

export function SpecializedGenerators() {
  const [tab, setTab] = useState<Tab>('pin');
  const { t } = useTranslation();

  return (
    <section
      className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6"
      aria-labelledby="specialized-heading"
    >
      <h2 id="specialized-heading" className="text-sm font-semibold text-[var(--color-text-primary)]">
        {t('specializedHeading')}
      </h2>

      <div className="flex gap-1 rounded-full bg-[var(--color-surface-elevated)] p-1" role="tablist">
        <TabButton active={tab === 'pin'} onClick={() => setTab('pin')}>
          {t('tabPin')}
        </TabButton>
        <TabButton active={tab === 'apikey'} onClick={() => setTab('apikey')}>
          {t('tabApiKey')}
        </TabButton>
      </div>

      {tab === 'pin' ? <PinGenerator /> : <ApiKeyGenerator />}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-[var(--color-accent)] text-white'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
      )}
    >
      {children}
    </button>
  );
}
