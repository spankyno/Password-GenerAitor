import { describe, it, expect } from 'vitest';
import { generateApiKey } from './apiKeyGenerator';

describe('generateApiKey', () => {
  it('genera hex de la longitud exacta usando solo dígitos hexadecimales', () => {
    const key = generateApiKey({ format: 'hex', length: 40 });
    expect(key).toHaveLength(40);
    expect(/^[0-9a-f]+$/.test(key)).toBe(true);
  });

  it('genera base64 de la longitud exacta usando el alfabeto correcto', () => {
    const key = generateApiKey({ format: 'base64', length: 32 });
    expect(key).toHaveLength(32);
    expect(/^[A-Za-z0-9+/]+$/.test(key)).toBe(true);
  });

  it('genera base58 sin caracteres ambiguos (0, O, I, l)', () => {
    const key = generateApiKey({ format: 'base58', length: 64 });
    expect(key).toHaveLength(64);
    for (const ambiguous of '0OIl') {
      expect(key.includes(ambiguous)).toBe(false);
    }
  });

  it('genera un UUID v4 válido independientemente de "length"', () => {
    const key = generateApiKey({ format: 'uuid', length: 999 });
    expect(key).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('genera un token personalizado respetando el charset dado', () => {
    const key = generateApiKey({ format: 'custom', length: 20, customCharset: 'AB12' });
    expect(key).toHaveLength(20);
    for (const ch of key) {
      expect('AB12'.includes(ch)).toBe(true);
    }
  });

  it('usa un alfabeto alfanumérico por defecto si el charset personalizado está vacío', () => {
    const key = generateApiKey({ format: 'custom', length: 15, customCharset: '' });
    expect(key).toHaveLength(15);
    expect(/^[A-Za-z0-9]+$/.test(key)).toBe(true);
  });
});
