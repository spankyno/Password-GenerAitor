import type {
  CrackTimeScenario,
  DetectedPattern,
  StrengthLevel,
  StrengthReasonCode,
  StrengthResult,
} from '@/types/password';
import { detectPatterns } from './patternDetection';

/**
 * Escenarios de ataque de referencia (guesses por segundo). Son valores
 * educativos de orden de magnitud, no benchmarks exactos de hardware real.
 */
const ATTACK_SCENARIOS: Array<{ id: string; labelKey: string; guessesPerSecond: number }> = [
  { id: 'online-throttled', labelKey: 'scenario.onlineThrottled', guessesPerSecond: 10 },
  { id: 'online', labelKey: 'scenario.online', guessesPerSecond: 1_000 },
  { id: 'home-attack', labelKey: 'scenario.homeAttack', guessesPerSecond: 10_000_000_000 },
  { id: 'gpu-cluster', labelKey: 'scenario.gpuCluster', guessesPerSecond: 1_000_000_000_000_000 },
];

/**
 * Calcula la entropía real en bits: log2(alfabetoEfectivo ^ longitud),
 * penalizada si se detectan patrones estructurales (reduce la entropía
 * "efectiva" porque un patrón conocido reduce drásticamente el espacio de
 * búsqueda real que un atacante necesita probar).
 */
export function calculateEntropyBits(password: string, alphabetSize: number): number {
  if (password.length === 0 || alphabetSize <= 1) return 0;
  const rawBits = password.length * Math.log2(alphabetSize);
  return rawBits;
}

export function applyPatternPenalty(rawBits: number, patterns: DetectedPattern[]): number {
  if (patterns.length === 0) return rawBits;
  // Cada carácter cubierto por un patrón conocido aporta muchísima menos
  // incertidumbre real. Penalizamos ~3.5 bits por carácter detectado como
  // parte de un patrón (aproximación conservadora y transparente).
  const coveredChars = new Set<number>();
  for (const p of patterns) {
    for (let i = p.index; i < p.index + p.match.length; i++) coveredChars.add(i);
  }
  const penalty = coveredChars.size * 3.5;
  return Math.max(rawBits - penalty, rawBits * 0.15); // nunca por debajo del 15% del valor bruto
}

export function classifyStrength(effectiveBits: number): StrengthLevel {
  if (effectiveBits < 28) return 'very-weak';
  if (effectiveBits < 36) return 'weak';
  if (effectiveBits < 60) return 'acceptable';
  if (effectiveBits < 80) return 'good';
  return 'excellent';
}

/**
 * Convierte segundos (como BigInt para soportar magnitudes enormes sin
 * notación científica) en una cadena legible tipo "12 millones de años".
 * Nunca usa toExponential ni notación 1e20.
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return 'un tiempo prácticamente infinito';
  if (seconds < 1) return 'menos de 1 segundo';

  const units: Array<[string, number]> = [
    ['segundos', 1],
    ['minutos', 60],
    ['horas', 3600],
    ['días', 86400],
    ['meses', 2_629_800], // ~30.44 días
    ['años', 31_557_600], // año juliano
    ['millones de años', 31_557_600 * 1_000_000],
    ['miles de millones de años', 31_557_600 * 1_000_000_000],
    ['billones de años', 31_557_600 * 1_000_000_000_000],
  ];

  // Elegimos la unidad más grande que aún dé un número >= 1, recorriendo de
  // mayor a menor para evitar exponentes/notación científica.
  for (let i = units.length - 1; i >= 0; i--) {
    const [name, unitSeconds] = units[i];
    const value = seconds / unitSeconds;
    if (value >= 1) {
      const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
      return `${formatNumber(rounded)} ${name}`;
    }
  }

  return `${Math.round(seconds)} segundos`;
}

function formatNumber(n: number): string {
  return n.toLocaleString('es-ES');
}

export function buildCrackTimeScenarios(effectiveBits: number): CrackTimeScenario[] {
  // Número medio de intentos hasta encontrar la contraseña: 2^(bits-1)
  const totalCombinations = Math.pow(2, effectiveBits) / 2;

  return ATTACK_SCENARIOS.map((scenario) => {
    const seconds = totalCombinations / scenario.guessesPerSecond;
    return {
      id: scenario.id,
      labelKey: scenario.labelKey,
      guessesPerSecond: scenario.guessesPerSecond,
      seconds,
      formatted: formatDuration(seconds),
    };
  });
}

export function buildReasons(
  password: string,
  effectiveBits: number,
  patterns: DetectedPattern[],
  alphabetSize: number
): StrengthReasonCode[] {
  const reasons: StrengthReasonCode[] = [];

  if (password.length < 8) {
    reasons.push({ code: 'length-low', meta: { length: password.length } });
  }

  if (patterns.length > 0) {
    for (const p of patterns.slice(0, 3)) {
      reasons.push({ code: 'contains-pattern', meta: { pattern: p.match, type: p.type } });
    }
  }

  const hasRepeats = /(.)\1{2,}/.test(password);
  if (hasRepeats) {
    reasons.push({ code: 'many-repeated-chars' });
  }

  if (/^\d+$/.test(password)) {
    reasons.push({ code: 'only-numbers' });
  }

  if (alphabetSize > 0 && alphabetSize <= 10 && password.length >= 20) {
    reasons.push({ code: 'length-compensates', meta: { length: password.length } });
  }

  if (alphabetSize >= 70) {
    reasons.push({ code: 'good-diversity' });
  }

  if (effectiveBits >= 80) {
    reasons.push({ code: 'high-entropy', meta: { bits: Math.round(effectiveBits) } });
  }

  return reasons;
}

/**
 * Punto de entrada único: analiza una contraseña ya generada y devuelve el
 * StrengthResult completo (nivel, bits, escenarios, patrones y motivos).
 */
export function analyzeStrength(password: string, alphabetSize: number): StrengthResult {
  const patterns = detectPatterns(password);
  const rawBits = calculateEntropyBits(password, alphabetSize);
  const effectiveBits = applyPatternPenalty(rawBits, patterns);

  return {
    level: classifyStrength(effectiveBits),
    entropyBits: Math.round(effectiveBits * 10) / 10,
    scenarios: buildCrackTimeScenarios(effectiveBits),
    patterns,
    reasons: buildReasons(password, effectiveBits, patterns, alphabetSize),
  };
}
