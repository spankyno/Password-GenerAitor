import type { CharacterSetOptions, ExclusionOptions, MinimumRequirements } from '@/types/password';
import { buildAlphabet, categorizeChar, UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS } from './charsets';
import { secureRandomChoice, secureShuffle } from '@/lib/crypto';
import { containsSequenceAt } from './patternDetection';

export interface BuildPasswordParams {
  length: number;
  charset: CharacterSetOptions;
  exclusions: ExclusionOptions;
  minimums: MinimumRequirements;
}

export interface BuildPasswordResult {
  password: string;
  /** true si no fue posible cumplir estrictamente todas las reglas (ej. mínimos > longitud) */
  relaxed: boolean;
  warning?: string;
}

const MAX_ATTEMPTS_PER_CHAR = 50;

/**
 * Construye una contraseña que:
 * 1. Cumple los mínimos por categoría.
 * 2. Respeta las exclusiones (ambiguos/similares/personalizados).
 * 3. Opcionalmente evita caracteres repetidos consecutivos y secuencias conocidas.
 *
 * Estrategia:
 *  - Generamos primero los caracteres "obligatorios" de cada categoría (mínimos).
 *  - Rellenamos el resto desde el alfabeto completo.
 *  - Barajamos con Fisher-Yates criptográfico.
 *  - Si "avoidRepeatedChars" o "avoidSequences" están activos, generamos
 *    carácter a carácter validando contra los ya colocados (con reintentos
 *    acotados) para no caer en bucles infinitos con configuraciones imposibles.
 */
export function buildPassword(params: BuildPasswordParams): BuildPasswordResult {
  const { length, charset, exclusions, minimums } = params;

  const alphabet = buildAlphabet(charset, exclusions);
  if (alphabet.length === 0) {
    return {
      password: '',
      relaxed: true,
      warning: 'no-charset-selected',
    };
  }

  const categoryPools = {
    uppercase: applyPoolExclusions(UPPERCASE, exclusions),
    lowercase: applyPoolExclusions(LOWERCASE, exclusions),
    numbers: applyPoolExclusions(NUMBERS, exclusions),
    symbols: applyPoolExclusions(SYMBOLS, exclusions),
  };

  const totalMinimums =
    (charset.uppercase ? minimums.minUppercase : 0) +
    (charset.lowercase ? minimums.minLowercase : 0) +
    (charset.numbers ? minimums.minNumbers : 0) +
    (charset.symbols ? minimums.minSymbols : 0);

  let relaxed = false;
  let warning: string | undefined;

  let effectiveLength = length;
  if (totalMinimums > length) {
    // La configuración es imposible: los mínimos exigidos no caben en la longitud.
    // Relajamos subiendo la longitud efectiva al total de mínimos y avisamos.
    effectiveLength = totalMinimums;
    relaxed = true;
    warning = 'minimums-exceed-length';
  }

  const required: string[] = [];

  if (charset.uppercase) pushRequired(required, categoryPools.uppercase, minimums.minUppercase);
  if (charset.lowercase) pushRequired(required, categoryPools.lowercase, minimums.minLowercase);
  if (charset.numbers) pushRequired(required, categoryPools.numbers, minimums.minNumbers);
  if (charset.symbols) pushRequired(required, categoryPools.symbols, minimums.minSymbols);

  const remainingSlots = effectiveLength - required.length;
  const filler: string[] = [];
  for (let i = 0; i < remainingSlots; i++) {
    filler.push(secureRandomChoice(alphabet.split('')));
  }

  let chars = secureShuffle([...required, ...filler]);

  if (exclusions.avoidRepeatedChars || exclusions.avoidSequences) {
    const rebuilt = rebuildAvoidingPatterns(chars, alphabet, exclusions);
    chars = rebuilt.chars;
    if (rebuilt.hitAttemptLimit) {
      relaxed = true;
      warning = warning ?? 'pattern-avoidance-relaxed';
    }
  }

  return {
    password: chars.join(''),
    relaxed,
    warning,
  };
}

function applyPoolExclusions(pool: string, exclusions: ExclusionOptions): string {
  const removed = new Set<string>();
  if (exclusions.excludeAmbiguous) {
    for (const ch of '0Oo1lI5S2Z8B6G') removed.add(ch);
  }
  if (exclusions.excludeSimilar) {
    for (const ch of "il1Lo0O'\"`|") removed.add(ch);
  }
  if (exclusions.customExcluded) {
    for (const ch of exclusions.customExcluded) removed.add(ch);
  }
  const filtered = pool
    .split('')
    .filter((ch) => !removed.has(ch))
    .join('');
  return filtered;
}

function pushRequired(target: string[], pool: string, count: number): void {
  if (!pool || count <= 0) return;
  for (let i = 0; i < count; i++) {
    target.push(secureRandomChoice(pool.split('')));
  }
}

/**
 * Recorre la contraseña ya barajada y, donde detecta una repetición
 * consecutiva o el inicio de una secuencia conocida, intenta sustituir ese
 * carácter por otro del alfabeto que no rompa las categorías/mínimos ya
 * satisfechos. Acotado a MAX_ATTEMPTS_PER_CHAR intentos por posición.
 */
function rebuildAvoidingPatterns(
  chars: string[],
  alphabet: string,
  exclusions: ExclusionOptions
): { chars: string[]; hitAttemptLimit: boolean } {
  const result = [...chars];
  let hitAttemptLimit = false;
  const alphabetArr = alphabet.split('');

  for (let i = 0; i < result.length; i++) {
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS_PER_CHAR && violatesPatternRules(result, i, exclusions)) {
      result[i] = secureRandomChoice(alphabetArr);
      attempts++;
    }
    if (attempts >= MAX_ATTEMPTS_PER_CHAR) {
      hitAttemptLimit = true;
    }
  }

  return { chars: result, hitAttemptLimit };
}

function violatesPatternRules(
  chars: string[],
  index: number,
  exclusions: ExclusionOptions
): boolean {
  if (exclusions.avoidRepeatedChars && index > 0 && chars[index] === chars[index - 1]) {
    return true;
  }
  if (exclusions.avoidSequences && containsSequenceAt(chars, index)) {
    return true;
  }
  return false;
}

/** Utilidad reexportada para el indicador de composición en tiempo real. */
export function getComposition(password: string) {
  const composition = { uppercase: 0, lowercase: 0, numbers: 0, symbols: 0 };
  for (const ch of password) {
    composition[categorizeChar(ch)]++;
  }
  return composition;
}
