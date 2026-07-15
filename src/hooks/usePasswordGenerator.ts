import { useCallback, useMemo, useState } from 'react';
import type { PasswordOptions } from '@/types/password';
import { buildPassword } from '@/utils/passwordBuilder';
import { buildAlphabet } from '@/utils/charsets';
import { analyzeStrength } from '@/utils/entropy';
import { buildPronounceablePassword } from '@/utils/pronounceable';

export function usePasswordGenerator(options: PasswordOptions) {
  const [nonce, setNonce] = useState(0);

  const regenerate = useCallback(() => setNonce((n) => n + 1), []);

  const alphabetSize = useMemo(
    () => buildAlphabet(options.charset, options.exclusions).length,
    [options.charset, options.exclusions]
  );

  const generation = useMemo(() => {
    if (options.pronounceable) {
      return buildPronounceablePassword({ targetLength: options.length });
    }
    return buildPassword({
      length: options.length,
      charset: options.charset,
      exclusions: options.exclusions,
      minimums: options.minimums,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.length,
    options.charset,
    options.exclusions,
    options.minimums,
    options.pronounceable,
    nonce,
  ]);

  const strength = useMemo(
    () => analyzeStrength(generation.password, options.pronounceable ? 26 : alphabetSize),
    [generation.password, alphabetSize, options.pronounceable]
  );

  return {
    password: generation.password,
    relaxed: generation.relaxed,
    warning: generation.warning,
    strength,
    regenerate,
  };
}
