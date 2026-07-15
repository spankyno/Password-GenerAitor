import type { CharacterSetOptions, ExclusionOptions } from '@/types/password';

export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const NUMBERS = '0123456789';
export const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

/**
 * Grupos de caracteres "ambiguos" que se confunden visualmente entre sí.
 * Por defecto, si el usuario activa "excluir ambiguos", se elimina de cada
 * grupo todo salvo un representante canónico (o se elimina el grupo entero,
 * según la estrategia elegida más abajo).
 */
export const AMBIGUOUS_GROUPS: string[] = ['0Oo', '1lI', '5S', '2Z', '8B', '6G'];

export const AMBIGUOUS_CHARS = AMBIGUOUS_GROUPS.join('');

/**
 * Caracteres "similares" (distinta categoría de la de ambiguos: aquí nos
 * referimos a pares que comparten trazo/forma y pueden inducir error al
 * transcribir a mano, ej. en papel o dictado).
 */
export const SIMILAR_CHARS = "il1Lo0O'\"`|";

/**
 * Construye el alfabeto efectivo a partir de las opciones de charset y las
 * exclusiones activas. Es una función pura: mismo input -> mismo output.
 */
export function buildAlphabet(
  charset: CharacterSetOptions,
  exclusions: ExclusionOptions
): string {
  let pool = '';
  if (charset.uppercase) pool += UPPERCASE;
  if (charset.lowercase) pool += LOWERCASE;
  if (charset.numbers) pool += NUMBERS;
  if (charset.symbols) pool += SYMBOLS;

  pool = applyExclusions(pool, exclusions);

  return dedupe(pool);
}

export function applyExclusions(pool: string, exclusions: ExclusionOptions): string {
  let charsToRemove = new Set<string>();

  if (exclusions.excludeAmbiguous) {
    for (const ch of AMBIGUOUS_CHARS) charsToRemove.add(ch);
  }
  if (exclusions.excludeSimilar) {
    for (const ch of SIMILAR_CHARS) charsToRemove.add(ch);
  }
  if (exclusions.customExcluded) {
    for (const ch of exclusions.customExcluded) charsToRemove.add(ch);
  }

  if (charsToRemove.size === 0) return pool;

  return pool
    .split('')
    .filter((ch) => !charsToRemove.has(ch))
    .join('');
}

function dedupe(pool: string): string {
  return Array.from(new Set(pool.split(''))).join('');
}

/** Devuelve a qué categoría pertenece un carácter (para el indicador de composición). */
export function categorizeChar(
  ch: string
): 'uppercase' | 'lowercase' | 'numbers' | 'symbols' {
  if (UPPERCASE.includes(ch)) return 'uppercase';
  if (LOWERCASE.includes(ch)) return 'lowercase';
  if (NUMBERS.includes(ch)) return 'numbers';
  return 'symbols';
}
