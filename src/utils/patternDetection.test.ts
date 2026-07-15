import { describe, it, expect } from 'vitest';
import { detectPatterns } from './patternDetection';

describe('detectPatterns', () => {
  it('detecta secuencias ascendentes como "abcdef"', () => {
    const patterns = detectPatterns('Xy9abcdefZ2');
    expect(patterns.some((p) => p.type === 'sequence')).toBe(true);
  });

  it('detecta secuencias numéricas como "12345"', () => {
    const patterns = detectPatterns('pass12345word');
    expect(patterns.some((p) => p.type === 'sequence')).toBe(true);
  });

  it('detecta patrones de teclado como "qwerty"', () => {
    const patterns = detectPatterns('myqwertypass');
    expect(patterns.some((p) => p.type === 'keyboard-pattern')).toBe(true);
  });

  it('detecta repeticiones de 3 o más caracteres iguales', () => {
    const patterns = detectPatterns('aaaBcd');
    expect(patterns.some((p) => p.type === 'repetition' && p.match === 'aaa')).toBe(true);
  });

  it('no marca repeticiones de menos de 3 caracteres', () => {
    const patterns = detectPatterns('aaBcd');
    expect(patterns.some((p) => p.type === 'repetition')).toBe(false);
  });

  it('detecta años de 4 dígitos', () => {
    const patterns = detectPatterns('summer2024fun');
    expect(patterns.some((p) => p.type === 'year' && p.match === '2024')).toBe(true);
  });

  it('detecta palabras comunes', () => {
    const patterns = detectPatterns('superpassword99');
    expect(patterns.some((p) => p.type === 'common-word' && p.match === 'password')).toBe(true);
  });

  it('devuelve array vacío para una contraseña sin patrones evidentes', () => {
    const patterns = detectPatterns('xK7#mQ2$vL9@');
    expect(patterns.length).toBe(0);
  });
});
