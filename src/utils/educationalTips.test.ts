import { describe, it, expect } from 'vitest';
import { generateEducationalTips } from './educationalTips';
import { DEFAULT_PASSWORD_OPTIONS } from '@/lib/defaultOptions';
import { analyzeStrength } from './entropy';
import type { PasswordOptions } from '@/types/password';

describe('generateEducationalTips', () => {
  it('incluye un consejo sobre longitud cuando la longitud es baja', () => {
    const options: PasswordOptions = { ...DEFAULT_PASSWORD_OPTIONS, length: 8 };
    const strength = analyzeStrength('aB3$fG7!', 70);
    const tips = generateEducationalTips(options, strength);
    expect(tips.some((t) => t.id === 'increase-length')).toBe(true);
  });

  it('sugiere activar símbolos si están desactivados', () => {
    const options: PasswordOptions = {
      ...DEFAULT_PASSWORD_OPTIONS,
      charset: { ...DEFAULT_PASSWORD_OPTIONS.charset, symbols: false },
    };
    const strength = analyzeStrength('abcDEF1234', 62);
    const tips = generateEducationalTips(options, strength);
    expect(tips.some((t) => t.id === 'enable-symbols')).toBe(true);
  });

  it('avisa cuando se detectan patrones en la contraseña actual', () => {
    const strength = analyzeStrength('abcdefgh12345', 36);
    const tips = generateEducationalTips(DEFAULT_PASSWORD_OPTIONS, strength);
    expect(tips.some((t) => t.id === 'pattern-detected')).toBe(true);
  });

  it('nunca devuelve más de 4 consejos', () => {
    const options: PasswordOptions = {
      ...DEFAULT_PASSWORD_OPTIONS,
      length: 6,
      charset: { uppercase: false, lowercase: false, numbers: true, symbols: false },
      exclusions: { ...DEFAULT_PASSWORD_OPTIONS.exclusions, excludeAmbiguous: true },
      pronounceable: false,
    };
    const strength = analyzeStrength('123123', 10);
    const tips = generateEducationalTips(options, strength);
    expect(tips.length).toBeLessThanOrEqual(4);
  });

  it('no repite ids entre consejos', () => {
    const strength = analyzeStrength('xK7#mQ2$vL9@', 90);
    const tips = generateEducationalTips(DEFAULT_PASSWORD_OPTIONS, strength);
    const ids = tips.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
