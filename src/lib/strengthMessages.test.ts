import { describe, it, expect } from 'vitest';
import { LEVEL_LABEL, LEVEL_COLOR, LEVEL_PERCENT, SCENARIO_LABEL, reasonToText } from './strengthMessages';
import type { StrengthLevel } from '@/types/password';

const ALL_LEVELS: StrengthLevel[] = ['very-weak', 'weak', 'acceptable', 'good', 'excellent'];

describe('strength label maps', () => {
  it('define etiqueta, color y porcentaje para los 5 niveles', () => {
    for (const level of ALL_LEVELS) {
      expect(LEVEL_LABEL[level]).toBeTruthy();
      expect(LEVEL_COLOR[level]).toMatch(/^var\(--color-strength-/);
      expect(LEVEL_PERCENT[level]).toBeGreaterThan(0);
    }
  });

  it('el porcentaje es estrictamente creciente con el nivel', () => {
    const percents = ALL_LEVELS.map((l) => LEVEL_PERCENT[l]);
    for (let i = 1; i < percents.length; i++) {
      expect(percents[i]).toBeGreaterThan(percents[i - 1]);
    }
  });

  it('define los 4 escenarios de ataque con su contexto online/offline', () => {
    expect(SCENARIO_LABEL['online-throttled'].context).toBe('online');
    expect(SCENARIO_LABEL['online'].context).toBe('online');
    expect(SCENARIO_LABEL['home-attack'].context).toBe('offline');
    expect(SCENARIO_LABEL['gpu-cluster'].context).toBe('offline');
  });
});

describe('reasonToText', () => {
  it('interpola metadatos en el texto de la razón', () => {
    const text = reasonToText({ code: 'length-low', meta: { length: 4 } });
    expect(text).toContain('4');
  });

  it('devuelve texto no vacío para cada código conocido', () => {
    const codes: Array<Parameters<typeof reasonToText>[0]['code']> = [
      'length-low',
      'length-compensates',
      'contains-pattern',
      'many-repeated-chars',
      'only-numbers',
      'low-charset-diversity',
      'good-diversity',
      'high-entropy',
    ];
    for (const code of codes) {
      expect(reasonToText({ code })).not.toBe('');
    }
  });
});
