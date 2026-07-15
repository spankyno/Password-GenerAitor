import { secureRandomDigits } from '@/lib/crypto';
import { detectPatterns } from './patternDetection';

export const PIN_MIN_LENGTH = 4;
export const PIN_MAX_LENGTH = 8;

/**
 * PINs conocidos como extremadamente frecuentes y por tanto débiles, más
 * allá de lo que ya cubre la detección genérica de patrones (secuencias,
 * repeticiones, años). Se comprueban como substring exacto de igual longitud
 * o como sufijo/base repetida para PINs más largos que 4 dígitos.
 */
const WEAK_PIN_CORES = [
  '1234', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
  '0000', '1212', '6969', '1990', '2024',
];

const MAX_ATTEMPTS = 200;

export interface GeneratePinResult {
  pin: string;
  relaxed: boolean;
}

export function isWeakPin(pin: string): boolean {
  if (WEAK_PIN_CORES.some((core) => pin.includes(core))) return true;
  if (hasAlternatingPattern(pin)) return true;
  // Reutilizamos la detección genérica: cubre secuencias (1234, 4321),
  // repeticiones de 3+ y años de 4 dígitos (1990, 2024, etc.) dentro del PIN.
  return detectPatterns(pin).length > 0;
}

function hasAlternatingPattern(pin: string): boolean {
  if (pin.length < 4) return false;
  for (let i = 0; i <= pin.length - 4; i++) {
    if (pin[i] === pin[i + 2] && pin[i + 1] === pin[i + 3] && pin[i] !== pin[i + 1]) {
      return true;
    }
  }
  return false;
}

/**
 * Genera un PIN de `length` dígitos evitando los patrones débiles más
 * comunes. Si tras MAX_ATTEMPTS no se encuentra un PIN "fuerte" (solo
 * plausible en longitudes muy cortas con alfabeto de dígitos limitado),
 * se devuelve el último generado marcado como `relaxed: true`.
 */
export function generatePin(length: number): GeneratePinResult {
  const safeLength = Math.min(Math.max(length, PIN_MIN_LENGTH), PIN_MAX_LENGTH);

  let pin = secureRandomDigits(safeLength);
  let attempts = 0;

  while (isWeakPin(pin) && attempts < MAX_ATTEMPTS) {
    pin = secureRandomDigits(safeLength);
    attempts++;
  }

  return { pin, relaxed: attempts >= MAX_ATTEMPTS };
}
