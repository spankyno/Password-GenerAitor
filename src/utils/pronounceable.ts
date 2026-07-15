import { secureRandomChoice, secureRandomInt } from '@/lib/crypto';

const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'.split('');
const VOWELS = 'aeiou'.split('');

export interface PronounceableParams {
  /** Longitud aproximada objetivo (el resultado puede variar levemente por los separadores) */
  targetLength: number;
}

export interface PronounceableResult {
  password: string;
  relaxed: boolean;
  warning?: string;
}

/**
 * Genera bloques tipo "Meko-Rafi-Zuno-82": sílabas consonante+vocal(+consonante),
 * con la primera letra de cada bloque en mayúscula, unidos por guiones, y un
 * sufijo numérico final de 2 dígitos. Mantiene buena entropía por bloque
 * (~ consonantes 21 x vocales 5 x consonantes 21 ≈ 2205 combinaciones/sílaba)
 * mientras sigue siendo fácil de leer y dictar en voz alta.
 */
export function buildPronounceablePassword(params: PronounceableParams): PronounceableResult {
  const { targetLength } = params;

  if (targetLength < 8) {
    return {
      password: buildSyllableBlock(),
      relaxed: true,
      warning: 'length-too-short-for-pronounceable',
    };
  }

  const blocks: string[] = [];
  let currentLength = 0;
  // Reservamos espacio para el sufijo numérico "-NN"
  const budget = targetLength - 3;

  while (currentLength < budget) {
    const block = buildSyllableBlock();
    blocks.push(block);
    currentLength += block.length + 1; // +1 por el guion separador
  }

  const suffix = secureRandomInt(90) + 10; // 10-99
  const password = `${blocks.join('-')}-${suffix}`;

  return { password, relaxed: false };
}

function buildSyllableBlock(): string {
  const c1 = secureRandomChoice(CONSONANTS);
  const v = secureRandomChoice(VOWELS);
  const c2 = secureRandomChoice(CONSONANTS);
  const raw = `${c1}${v}${c2}`;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
