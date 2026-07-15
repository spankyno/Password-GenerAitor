import type { DetectedPattern } from '@/types/password';

const ASCENDING = 'abcdefghijklmnopqrstuvwxyz0123456789';
const DESCENDING = ASCENDING.split('').reverse().join('');

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];

/** Lista pequeña y local de palabras/nombres frecuentes en contraseñas. */
export const COMMON_WORDS = [
  'password', 'contraseña', 'admin', 'welcome', 'letmein', 'dragon',
  'monkey', 'master', 'iloveyou', 'sunshine', 'princess', 'football',
  'baseball', 'superman', 'batman', 'trustno1', 'qwerty', 'abc123',
];

export const COMMON_NAMES = [
  'maria', 'jose', 'juan', 'carlos', 'ana', 'luis', 'laura', 'pedro',
  'john', 'michael', 'david', 'james', 'robert', 'mary', 'jennifer',
];

const MIN_SEQUENCE_LEN = 3;

/**
 * Comprueba si, a partir de `index`, los caracteres forman una secuencia
 * ascendente/descendente o un patrón de teclado de longitud >= 3.
 * Se usa tanto para detección de patrones como para el generador (para
 * poder "romper" una secuencia mientras se construye la contraseña).
 */
export function containsSequenceAt(chars: string[], index: number): boolean {
  if (index < MIN_SEQUENCE_LEN - 1) return false;
  const windowChars = chars.slice(index - (MIN_SEQUENCE_LEN - 1), index + 1).join('').toLowerCase();

  if (ASCENDING.includes(windowChars) || DESCENDING.includes(windowChars)) {
    return true;
  }
  return KEYBOARD_ROWS.some((row) => row.includes(windowChars) || row.split('').reverse().join('').includes(windowChars));
}

export function detectPatterns(password: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const lower = password.toLowerCase();

  patterns.push(...detectSequences(lower));
  patterns.push(...detectKeyboardPatterns(lower));
  patterns.push(...detectRepetitions(password));
  patterns.push(...detectYearsAndDates(password));
  patterns.push(...detectWordList(lower, COMMON_WORDS, 'common-word'));
  patterns.push(...detectWordList(lower, COMMON_NAMES, 'common-name'));

  return patterns;
}

function detectSequences(lower: string): DetectedPattern[] {
  const found: DetectedPattern[] = [];
  for (let i = 0; i <= lower.length - MIN_SEQUENCE_LEN; i++) {
    const chunk = lower.slice(i, i + MIN_SEQUENCE_LEN);
    if (ASCENDING.includes(chunk) || DESCENDING.includes(chunk)) {
      found.push({ type: 'sequence', match: chunk, index: i });
    }
  }
  return found;
}

function detectKeyboardPatterns(lower: string): DetectedPattern[] {
  const found: DetectedPattern[] = [];
  for (let i = 0; i <= lower.length - MIN_SEQUENCE_LEN; i++) {
    const chunk = lower.slice(i, i + MIN_SEQUENCE_LEN);
    const isKeyboardRow = KEYBOARD_ROWS.some(
      (row) => row.includes(chunk) || row.split('').reverse().join('').includes(chunk)
    );
    if (isKeyboardRow) {
      found.push({ type: 'keyboard-pattern', match: chunk, index: i });
    }
  }
  return found;
}

function detectRepetitions(password: string): DetectedPattern[] {
  const found: DetectedPattern[] = [];
  let runStart = 0;
  for (let i = 1; i <= password.length; i++) {
    if (i < password.length && password[i] === password[runStart]) continue;
    const runLength = i - runStart;
    if (runLength >= 3) {
      found.push({
        type: 'repetition',
        match: password.slice(runStart, i),
        index: runStart,
      });
    }
    runStart = i;
  }
  return found;
}

function detectYearsAndDates(password: string): DetectedPattern[] {
  const found: DetectedPattern[] = [];

  const yearRegex = /(19|20)\d{2}/g;
  for (const match of password.matchAll(yearRegex)) {
    found.push({ type: 'year', match: match[0], index: match.index ?? 0 });
  }

  // Fechas simples DDMMYYYY, DD-MM-YYYY, DD/MM/YYYY
  const dateRegex = /(0[1-9]|[12]\d|3[01])[-/]?(0[1-9]|1[0-2])[-/]?(19|20)\d{2}/g;
  for (const match of password.matchAll(dateRegex)) {
    found.push({ type: 'date', match: match[0], index: match.index ?? 0 });
  }

  return found;
}

function detectWordList(
  lower: string,
  list: string[],
  type: 'common-word' | 'common-name'
): DetectedPattern[] {
  const found: DetectedPattern[] = [];
  for (const word of list) {
    const idx = lower.indexOf(word);
    if (idx !== -1 && word.length >= 3) {
      found.push({ type, match: word, index: idx });
    }
  }
  return found;
}
