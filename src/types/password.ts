/**
 * Tipos centrales del generador de contraseñas.
 * Mantener este archivo como única fuente de verdad para las formas de datos
 * que fluyen entre lib/, utils/, hooks/ y components/.
 */

export interface CharacterSetOptions {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export interface ExclusionOptions {
  excludeAmbiguous: boolean;
  excludeSimilar: boolean;
  avoidRepeatedChars: boolean;
  avoidSequences: boolean;
  /** Caracteres personalizados que el usuario quiere excluir siempre */
  customExcluded: string;
}

export interface MinimumRequirements {
  minUppercase: number;
  minLowercase: number;
  minNumbers: number;
  minSymbols: number;
}

export interface PasswordOptions {
  length: number;
  charset: CharacterSetOptions;
  exclusions: ExclusionOptions;
  minimums: MinimumRequirements;
  /** Modo pronunciable: genera bloques tipo "Meko-Rafi-Zuno-82" */
  pronounceable: boolean;
}

export type StrengthLevel =
  | 'very-weak'
  | 'weak'
  | 'acceptable'
  | 'good'
  | 'excellent';

export interface CrackTimeScenario {
  id: string;
  labelKey: string; // clave i18n, ej. "scenario.homeAttack"
  guessesPerSecond: number;
  /** Segundos estimados, como número exacto (puede ser gigantesco -> usar BigInt en el cálculo) */
  seconds: number;
  /** Cadena ya formateada en unidades legibles, sin notación científica */
  formatted: string;
}

export interface DetectedPattern {
  type:
    | 'sequence'
    | 'keyboard-pattern'
    | 'repetition'
    | 'common-word'
    | 'year'
    | 'date'
    | 'common-name';
  /** Fragmento detectado, para resaltar en la UI */
  match: string;
  /** Posición dentro de la contraseña */
  index: number;
}

export interface StrengthReasonCode {
  code:
    | 'length-low'
    | 'length-compensates'
    | 'contains-pattern'
    | 'many-repeated-chars'
    | 'only-numbers'
    | 'low-charset-diversity'
    | 'good-diversity'
    | 'high-entropy';
  /** Datos para interpolar en el mensaje i18n, ej. { pattern: "12345" } */
  meta?: Record<string, string | number>;
}

export interface StrengthResult {
  level: StrengthLevel;
  entropyBits: number;
  scenarios: CrackTimeScenario[];
  patterns: DetectedPattern[];
  reasons: StrengthReasonCode[];
}

export interface GeneratedPassword {
  id: string;
  value: string;
  createdAt: number;
  isFavorite: boolean;
  strength: StrengthResult;
}

export interface CharacterComposition {
  uppercase: number;
  lowercase: number;
  numbers: number;
  symbols: number;
}
