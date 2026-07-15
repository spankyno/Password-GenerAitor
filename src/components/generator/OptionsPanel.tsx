import type { CharacterSetOptions, ExclusionOptions } from '@/types/password';
import { CheckboxRow } from '@/components/shared/CheckboxRow';
import { useTranslation } from '@/context/LocaleContext';

interface OptionsPanelProps {
  charset: CharacterSetOptions;
  exclusions: ExclusionOptions;
  onToggleCharset: (key: keyof CharacterSetOptions) => void;
  onToggleExclusion: (
    key: 'excludeAmbiguous' | 'excludeSimilar' | 'avoidRepeatedChars' | 'avoidSequences'
  ) => void;
}

export function OptionsPanel({
  charset,
  exclusions,
  onToggleCharset,
  onToggleExclusion,
}: OptionsPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="sr-only">{t('charsetHeading')} / {t('exclusionsHeading')}</h2>
      <section aria-labelledby="charset-heading">
        <h3
          id="charset-heading"
          className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]"
        >
          {t('charsetHeading')}
        </h3>
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
          <CheckboxRow
            id="charset-uppercase"
            label={t('charsetUppercase')}
            description="A–Z"
            checked={charset.uppercase}
            onChange={() => onToggleCharset('uppercase')}
          />
          <CheckboxRow
            id="charset-lowercase"
            label={t('charsetLowercase')}
            description="a–z"
            checked={charset.lowercase}
            onChange={() => onToggleCharset('lowercase')}
          />
          <CheckboxRow
            id="charset-numbers"
            label={t('charsetNumbers')}
            description="0–9"
            checked={charset.numbers}
            onChange={() => onToggleCharset('numbers')}
          />
          <CheckboxRow
            id="charset-symbols"
            label={t('charsetSymbols')}
            description="!@#$%…"
            checked={charset.symbols}
            onChange={() => onToggleCharset('symbols')}
          />
        </div>
      </section>

      <section aria-labelledby="exclusions-heading">
        <h3
          id="exclusions-heading"
          className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]"
        >
          {t('exclusionsHeading')}
        </h3>
        <div className="flex flex-col gap-0.5">
          <CheckboxRow
            id="exclude-ambiguous"
            label={t('exclusionAmbiguous')}
            description={t('exclusionAmbiguousDesc')}
            checked={exclusions.excludeAmbiguous}
            onChange={() => onToggleExclusion('excludeAmbiguous')}
          />
          <CheckboxRow
            id="exclude-similar"
            label={t('exclusionSimilar')}
            description={t('exclusionSimilarDesc')}
            checked={exclusions.excludeSimilar}
            onChange={() => onToggleExclusion('excludeSimilar')}
          />
          <CheckboxRow
            id="avoid-repeated"
            label={t('exclusionAvoidRepeated')}
            description={t('exclusionAvoidRepeatedDesc')}
            checked={exclusions.avoidRepeatedChars}
            onChange={() => onToggleExclusion('avoidRepeatedChars')}
          />
          <CheckboxRow
            id="avoid-sequences"
            label={t('exclusionAvoidSequences')}
            description={t('exclusionAvoidSequencesDesc')}
            checked={exclusions.avoidSequences}
            onChange={() => onToggleExclusion('avoidSequences')}
          />
        </div>
      </section>
    </div>
  );
}
