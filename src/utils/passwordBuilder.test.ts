import { describe, it, expect } from 'vitest';
import { buildPassword, getComposition } from './passwordBuilder';
import type { CharacterSetOptions, ExclusionOptions, MinimumRequirements } from '@/types/password';

const fullCharset: CharacterSetOptions = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

const noExclusions: ExclusionOptions = {
  excludeAmbiguous: false,
  excludeSimilar: false,
  avoidRepeatedChars: false,
  avoidSequences: false,
  customExcluded: '',
};

const noMinimums: MinimumRequirements = {
  minUppercase: 0,
  minLowercase: 0,
  minNumbers: 0,
  minSymbols: 0,
};

describe('buildPassword', () => {
  it('genera contraseñas de la longitud solicitada', () => {
    for (const length of [4, 8, 16, 32, 64, 128]) {
      const { password } = buildPassword({
        length,
        charset: fullCharset,
        exclusions: noExclusions,
        minimums: noMinimums,
      });
      expect(password).toHaveLength(length);
    }
  });

  it('respeta los mínimos por categoría', () => {
    const minimums: MinimumRequirements = {
      minUppercase: 3,
      minLowercase: 3,
      minNumbers: 3,
      minSymbols: 3,
    };
    const { password } = buildPassword({
      length: 20,
      charset: fullCharset,
      exclusions: noExclusions,
      minimums,
    });
    const composition = getComposition(password);
    expect(composition.uppercase).toBeGreaterThanOrEqual(3);
    expect(composition.lowercase).toBeGreaterThanOrEqual(3);
    expect(composition.numbers).toBeGreaterThanOrEqual(3);
    expect(composition.symbols).toBeGreaterThanOrEqual(3);
  });

  it('no incluye caracteres ambiguos cuando excludeAmbiguous está activo', () => {
    const exclusions: ExclusionOptions = { ...noExclusions, excludeAmbiguous: true };
    for (let i = 0; i < 30; i++) {
      const { password } = buildPassword({
        length: 40,
        charset: fullCharset,
        exclusions,
        minimums: noMinimums,
      });
      for (const ambiguous of '0Oo1lI5S2Z8B6G') {
        expect(password.includes(ambiguous)).toBe(false);
      }
    }
  });

  it('no incluye caracteres personalizados excluidos', () => {
    const exclusions: ExclusionOptions = { ...noExclusions, customExcluded: 'aeiou' };
    const { password } = buildPassword({
      length: 50,
      charset: { uppercase: false, lowercase: true, numbers: false, symbols: false },
      exclusions,
      minimums: noMinimums,
    });
    for (const vowel of 'aeiou') {
      expect(password.includes(vowel)).toBe(false);
    }
  });

  it('evita caracteres repetidos consecutivos cuando avoidRepeatedChars está activo', () => {
    const exclusions: ExclusionOptions = { ...noExclusions, avoidRepeatedChars: true };
    for (let i = 0; i < 20; i++) {
      const { password } = buildPassword({
        length: 30,
        charset: fullCharset,
        exclusions,
        minimums: noMinimums,
      });
      for (let j = 1; j < password.length; j++) {
        expect(password[j]).not.toBe(password[j - 1]);
      }
    }
  });

  it('marca relaxed=true cuando los mínimos exceden la longitud', () => {
    const minimums: MinimumRequirements = {
      minUppercase: 5,
      minLowercase: 5,
      minNumbers: 5,
      minSymbols: 5,
    };
    const { relaxed, warning, password } = buildPassword({
      length: 4,
      charset: fullCharset,
      exclusions: noExclusions,
      minimums,
    });
    expect(relaxed).toBe(true);
    expect(warning).toBe('minimums-exceed-length');
    expect(password.length).toBeGreaterThanOrEqual(20);
  });

  it('devuelve warning si no hay ningún charset seleccionado', () => {
    const { password, warning } = buildPassword({
      length: 10,
      charset: { uppercase: false, lowercase: false, numbers: false, symbols: false },
      exclusions: noExclusions,
      minimums: noMinimums,
    });
    expect(password).toBe('');
    expect(warning).toBe('no-charset-selected');
  });
});
