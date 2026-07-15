import { describe, it, expect } from 'vitest';
import { secureRandomInt, secureRandomChoice, secureShuffle, secureRandomDigits, secureUUIDv4 } from './crypto';

describe('secureRandomInt', () => {
  it('siempre devuelve un valor dentro de [0, max)', () => {
    for (let i = 0; i < 2000; i++) {
      const v = secureRandomInt(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
    }
  });

  it('lanza error si max <= 0', () => {
    expect(() => secureRandomInt(0)).toThrow();
    expect(() => secureRandomInt(-1)).toThrow();
  });

  it('cubre todos los valores posibles en un rango pequeño (distribución no degenerada)', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) {
      seen.add(secureRandomInt(4));
    }
    expect(seen.size).toBe(4);
  });
});

describe('secureRandomChoice', () => {
  it('elige siempre un elemento presente en el array', () => {
    const items = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 200; i++) {
      expect(items).toContain(secureRandomChoice(items));
    }
  });

  it('lanza error con array vacío', () => {
    expect(() => secureRandomChoice([])).toThrow();
  });
});

describe('secureShuffle', () => {
  it('no muta el array original y conserva los mismos elementos', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = secureShuffle(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
    expect(shuffled.sort()).toEqual(original.sort());
  });
});

describe('secureRandomDigits', () => {
  it('genera la cantidad exacta de dígitos solicitada', () => {
    const digits = secureRandomDigits(6);
    expect(digits).toHaveLength(6);
    expect(/^\d{6}$/.test(digits)).toBe(true);
  });
});

describe('secureUUIDv4', () => {
  it('genera un UUID v4 con formato válido', () => {
    const uuid = secureUUIDv4();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});
