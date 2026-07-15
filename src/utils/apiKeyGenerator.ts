import { secureRandomChoice, secureUUIDv4 } from '@/lib/crypto';

export type ApiKeyFormat = 'hex' | 'base64' | 'base58' | 'uuid' | 'custom';

export const API_KEY_MIN_LENGTH = 8;
export const API_KEY_MAX_LENGTH = 256;
export const API_KEY_DEFAULT_LENGTH = 32;

const HEX_ALPHABET = '0123456789abcdef';
const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Alfabeto Base58 (Bitcoin): excluye 0, O, I, l para evitar ambigüedad visual.
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const DEFAULT_CUSTOM_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export interface ApiKeyOptions {
  format: ApiKeyFormat;
  /** Ignorado cuando format === 'uuid' (longitud fija por especificación) */
  length: number;
  /** Solo se usa cuando format === 'custom'; si viene vacío, se usa el alfabeto alfanumérico por defecto */
  customCharset?: string;
}

/**
 * Genera cada carácter de forma independiente y criptográficamente segura a
 * partir del alfabeto dado. Es un enfoque deliberado frente a "codificar N
 * bytes aleatorios": permite que la longitud configurable se corresponda
 * exactamente con el número de caracteres del resultado, algo más predecible
 * y útil para un generador de tokens/API keys de uso general.
 */
function generateFromAlphabet(alphabet: string, length: number): string {
  const chars = alphabet.split('');
  let out = '';
  for (let i = 0; i < length; i++) {
    out += secureRandomChoice(chars);
  }
  return out;
}

export function generateApiKey(options: ApiKeyOptions): string {
  const { format, length, customCharset } = options;

  switch (format) {
    case 'hex':
      return generateFromAlphabet(HEX_ALPHABET, length);
    case 'base64':
      return generateFromAlphabet(BASE64_ALPHABET, length);
    case 'base58':
      return generateFromAlphabet(BASE58_ALPHABET, length);
    case 'uuid':
      return secureUUIDv4();
    case 'custom': {
      const alphabet = customCharset && customCharset.length > 0 ? customCharset : DEFAULT_CUSTOM_ALPHABET;
      return generateFromAlphabet(alphabet, length);
    }
  }
}

export const API_KEY_FORMAT_LABEL: Record<ApiKeyFormat, string> = {
  hex: 'Hexadecimal',
  base64: 'Base64',
  base58: 'Base58',
  uuid: 'UUID v4',
  custom: 'Token personalizado',
};
