import type { PasswordOptions, StrengthResult } from '@/types/password';

export interface Tip {
  id: string;
  text: string;
}

const GENERAL_TIPS: Tip[] = [
  {
    id: 'length-vs-time',
    text: 'Una contraseña de 8 caracteres puede romperse miles de veces más rápido que una de 16.',
  },
  {
    id: 'symbols-search-space',
    text: 'Los símbolos aumentan el espacio de búsqueda: cada carácter añadido multiplica, no suma, las combinaciones posibles.',
  },
  {
    id: 'password-manager',
    text: 'Los gestores de contraseñas permiten usar claves mucho más largas sin tener que memorizarlas.',
  },
  {
    id: 'no-reuse',
    text: 'Evita reutilizar contraseñas: si una se filtra en una brecha, las demás cuentas quedan expuestas.',
  },
  {
    id: 'mfa',
    text: 'Activar la verificación en dos pasos protege tu cuenta incluso si la contraseña llega a filtrarse.',
  },
];

/**
 * Genera una lista de consejos priorizando los que son relevantes para la
 * configuración actual (longitud, charset, exclusiones activas, resultado de
 * fortaleza) y rellenando con consejos generales hasta un máximo razonable.
 * Es una función pura: mismo input -> mismo output, sin estado ni red.
 */
export function generateEducationalTips(
  options: PasswordOptions,
  strength: StrengthResult
): Tip[] {
  const contextual: Tip[] = [];

  if (options.length < 12) {
    contextual.push({
      id: 'increase-length',
      text: `Con ${options.length} caracteres, subir la longitud es la forma más eficaz de ganar fortaleza: cada carácter extra multiplica las combinaciones posibles.`,
    });
  }

  if (!options.charset.symbols) {
    contextual.push({
      id: 'enable-symbols',
      text: 'Activar símbolos amplía el alfabeto disponible y hace la contraseña más difícil de forzar sin alargarla.',
    });
  }

  if (options.charset.numbers && !options.charset.uppercase && !options.charset.lowercase && !options.charset.symbols) {
    contextual.push({
      id: 'numbers-only-weak',
      text: 'Usar solo números limita mucho el alfabeto; incluso un PIN largo es más débil que una contraseña mixta corta.',
    });
  }

  if (options.exclusions.excludeAmbiguous || options.exclusions.excludeSimilar) {
    contextual.push({
      id: 'exclusions-tradeoff',
      text: 'Excluir caracteres ambiguos o similares facilita transcribir la contraseña a mano, a cambio de un alfabeto algo más pequeño.',
    });
  }

  if (strength.patterns.length > 0) {
    contextual.push({
      id: 'pattern-detected',
      text: 'Se detectó un patrón reconocible en la contraseña actual (secuencia, palabra común o repetición), lo que reduce su fortaleza real.',
    });
  }

  if (options.pronounceable) {
    contextual.push({
      id: 'pronounceable-tradeoff',
      text: 'El modo pronunciable facilita recordar y dictar la contraseña mantiene buena entropía combinando varias sílabas.',
    });
  }

  if (strength.level === 'excellent') {
    contextual.push({
      id: 'excellent-reached',
      text: 'Esta configuración alcanza un nivel excelente: sería extremadamente costosa de forzar incluso con hardware especializado.',
    });
  }

  // Rellenar con consejos generales (sin repetir ids ya incluidos) hasta un máximo de 4.
  const usedIds = new Set(contextual.map((t) => t.id));
  const filler = GENERAL_TIPS.filter((t) => !usedIds.has(t.id));

  return [...contextual, ...filler].slice(0, 4);
}
