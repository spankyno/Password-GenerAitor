import { describe, it, expect } from 'vitest';
import {
  calculateEntropyBits,
  classifyStrength,
  formatDuration,
  buildCrackTimeScenarios,
  analyzeStrength,
} from './entropy';

describe('calculateEntropyBits', () => {
  it('calcula bits correctamente para un alfabeto y longitud conocidos', () => {
    // log2(62^8) ≈ 47.6 bits
    const bits = calculateEntropyBits('aB3dE6gH', 62);
    expect(bits).toBeCloseTo(8 * Math.log2(62), 1);
  });

  it('devuelve 0 si la contraseña está vacía', () => {
    expect(calculateEntropyBits('', 62)).toBe(0);
  });
});

describe('classifyStrength', () => {
  it('clasifica correctamente los umbrales', () => {
    expect(classifyStrength(10)).toBe('very-weak');
    expect(classifyStrength(30)).toBe('weak');
    expect(classifyStrength(50)).toBe('acceptable');
    expect(classifyStrength(70)).toBe('good');
    expect(classifyStrength(90)).toBe('excellent');
  });
});

describe('formatDuration', () => {
  it('nunca usa notación científica', () => {
    const formatted = formatDuration(1e30);
    expect(formatted).not.toMatch(/e\+?\d/i);
  });

  it('formatea segundos pequeños de forma legible', () => {
    expect(formatDuration(15)).toContain('segundos');
  });

  it('formatea rangos de años grandes de forma legible', () => {
    const formatted = formatDuration(31_557_600 * 250);
    expect(formatted).toContain('años');
  });

  it('formatea magnitudes astronómicas con unidades agregadas, no exponentes', () => {
    const formatted = formatDuration(31_557_600 * 12_000_000);
    expect(formatted).toContain('millones de años');
  });
});

describe('buildCrackTimeScenarios', () => {
  it('devuelve un escenario por cada tipo de ataque y todos con formato legible', () => {
    const scenarios = buildCrackTimeScenarios(60);
    expect(scenarios.length).toBeGreaterThan(0);
    for (const s of scenarios) {
      expect(s.formatted).not.toMatch(/e\+?\d/i);
    }
  });
});

describe('analyzeStrength', () => {
  it('penaliza contraseñas con patrones detectables', () => {
    const withPattern = analyzeStrength('abcdefgh', 26);
    const withoutPattern = analyzeStrength('xjqzkwmp', 26);
    expect(withPattern.entropyBits).toBeLessThan(withoutPattern.entropyBits);
  });

  it('incluye razones explicativas', () => {
    const result = analyzeStrength('12345678', 10);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.some((r: { code: string }) => r.code === 'only-numbers')).toBe(true);
  });
});
