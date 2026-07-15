import { describe, it, expect } from 'vitest';
import { generatePin, isWeakPin } from './pinGenerator';

describe('isWeakPin', () => {
  it('marca como débiles los PINs obviamente comunes', () => {
    expect(isWeakPin('1234')).toBe(true);
    expect(isWeakPin('1111')).toBe(true);
    expect(isWeakPin('0000')).toBe(true);
    expect(isWeakPin('1212')).toBe(true);
    expect(isWeakPin('6969')).toBe(true);
    expect(isWeakPin('1990')).toBe(true);
    expect(isWeakPin('2024')).toBe(true);
    expect(isWeakPin('4321')).toBe(true); // secuencia descendente
  });

  it('no marca como débil un PIN sin patrones evidentes', () => {
    expect(isWeakPin('7391')).toBe(false);
    expect(isWeakPin('58204')).toBe(false);
  });
});

describe('generatePin', () => {
  it('genera PINs de la longitud solicitada dentro de 4-8', () => {
    for (const length of [4, 5, 6, 7, 8]) {
      const { pin } = generatePin(length);
      expect(pin).toHaveLength(length);
      expect(/^\d+$/.test(pin)).toBe(true);
    }
  });

  it('nunca genera un PIN de la lista de patrones débiles', () => {
    for (let i = 0; i < 50; i++) {
      const { pin } = generatePin(4);
      expect(isWeakPin(pin)).toBe(false);
    }
  });

  it('acota la longitud al rango permitido', () => {
    expect(generatePin(2).pin).toHaveLength(4);
    expect(generatePin(20).pin).toHaveLength(8);
  });
});
