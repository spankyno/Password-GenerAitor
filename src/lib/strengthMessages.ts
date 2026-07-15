import type { StrengthLevel, StrengthReasonCode } from '@/types/password';

export const LEVEL_LABEL: Record<StrengthLevel, string> = {
  'very-weak': 'Muy débil',
  weak: 'Débil',
  acceptable: 'Aceptable',
  good: 'Buena',
  excellent: 'Excelente',
};

export const LEVEL_COLOR: Record<StrengthLevel, string> = {
  'very-weak': 'var(--color-strength-very-weak)',
  weak: 'var(--color-strength-weak)',
  acceptable: 'var(--color-strength-acceptable)',
  good: 'var(--color-strength-good)',
  excellent: 'var(--color-strength-excellent)',
};

/** Porcentaje de la barra de nivel (0-100), solo para el indicador visual */
export const LEVEL_PERCENT: Record<StrengthLevel, number> = {
  'very-weak': 15,
  weak: 35,
  acceptable: 55,
  good: 78,
  excellent: 100,
};

export const SCENARIO_LABEL: Record<string, { title: string; context: 'online' | 'offline' }> = {
  'online-throttled': { title: 'En línea (con límite de intentos)', context: 'online' },
  online: { title: 'En línea (sin límite)', context: 'online' },
  'home-attack': { title: 'Ataque doméstico (GPU de consumo)', context: 'offline' },
  'gpu-cluster': { title: 'Cluster GPU / nube', context: 'offline' },
};

export function reasonToText(reason: StrengthReasonCode): string {
  const meta = reason.meta ?? {};
  switch (reason.code) {
    case 'length-low':
      return `La longitud es baja (${meta.length ?? ''} caracteres).`;
    case 'length-compensates':
      return `La longitud (${meta.length ?? ''} caracteres) compensa un alfabeto reducido.`;
    case 'contains-pattern':
      return `Contiene un patrón reconocible: "${meta.pattern ?? ''}".`;
    case 'many-repeated-chars':
      return 'Tiene varios caracteres repetidos consecutivos.';
    case 'only-numbers':
      return 'Solo utiliza números.';
    case 'low-charset-diversity':
      return 'Usa pocos tipos de caracteres distintos.';
    case 'good-diversity':
      return 'Combina bien varios tipos de caracteres.';
    case 'high-entropy':
      return `Tiene una entropía muy alta (~${meta.bits ?? ''} bits).`;
    default:
      return '';
  }
}
