import { useCallback, useState } from 'react';
import type { GeneratedPassword, PasswordOptions } from '@/types/password';
import { buildPassword } from '@/utils/passwordBuilder';
import { buildPronounceablePassword } from '@/utils/pronounceable';
import { buildAlphabet } from '@/utils/charsets';
import { analyzeStrength } from '@/utils/entropy';
import { secureUUIDv4 } from '@/lib/crypto';

export const BULK_COUNT_OPTIONS = [10, 20, 30, 40, 50] as const;
export type BulkCount = (typeof BULK_COUNT_OPTIONS)[number];

export function useBulkGeneration(options: PasswordOptions) {
  const [items, setItems] = useState<GeneratedPassword[]>([]);
  const [lastCount, setLastCount] = useState<BulkCount | null>(null);

  const generate = useCallback(
    (count: BulkCount) => {
      const alphabetSize = buildAlphabet(options.charset, options.exclusions).length;

      const generated: GeneratedPassword[] = Array.from({ length: count }, () => {
        const result = options.pronounceable
          ? buildPronounceablePassword({ targetLength: options.length })
          : buildPassword({
              length: options.length,
              charset: options.charset,
              exclusions: options.exclusions,
              minimums: options.minimums,
            });

        const strength = analyzeStrength(
          result.password,
          options.pronounceable ? 26 : alphabetSize
        );

        return {
          id: secureUUIDv4(),
          value: result.password,
          createdAt: Date.now(),
          isFavorite: false,
          strength,
        };
      });

      setItems(generated);
      setLastCount(count);
    },
    [options]
  );

  const toggleFavorite = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setLastCount(null);
  }, []);

  return { items, lastCount, generate, toggleFavorite, clear };
}
