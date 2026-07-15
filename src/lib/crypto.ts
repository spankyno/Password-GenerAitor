/**
 * lib/crypto.ts
 *
 * Única puerta de entrada a la generación de aleatoriedad de toda la app.
 * REGLA DE ORO: nunca usar Math.random(). Todo pasa por crypto.getRandomValues().
 *
 * Usamos "rejection sampling" para elegir un índice en [0, max) sin sesgo:
 * un módulo simple (randomByte % max) introduce sesgo cuando max no divide
 * exactamente el rango del tipo numérico usado. Descartamos los valores que
 * caerían en la parte sesgada del rango y volvemos a pedir otro byte.
 */

function getCrypto(): Crypto {
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    throw new Error(
      'Web Crypto API no disponible en este entorno. La app requiere crypto.getRandomValues().'
    );
  }
  return crypto;
}

/**
 * Devuelve un entero aleatorio criptográficamente seguro en [0, max),
 * sin sesgo de módulo, usando Uint32Array + rejection sampling.
 */
export function secureRandomInt(max: number): number {
  if (max <= 0) {
    throw new Error('secureRandomInt: max debe ser mayor que 0');
  }
  if (max > 0xffffffff) {
    throw new Error('secureRandomInt: max excede el rango de 32 bits soportado');
  }

  const cryptoObj = getCrypto();

  // Mayor múltiplo de "max" que cabe en el rango de Uint32 (2^32).
  // Cualquier valor igual o superior a este límite se descarta.
  const range = 0x100000000; // 2^32
  const limit = range - (range % max);

  const buffer = new Uint32Array(1);
  let value: number;
  do {
    cryptoObj.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);

  return value % max;
}

/**
 * Elige un elemento aleatorio de un array de forma criptográficamente segura.
 */
export function secureRandomChoice<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('secureRandomChoice: el array no puede estar vacío');
  }
  const index = secureRandomInt(items.length);
  return items[index];
}

/**
 * Baraja un array in-place con el algoritmo Fisher-Yates usando aleatoriedad
 * criptográficamente segura. Devuelve una nueva copia (no muta el original).
 */
export function secureShuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Genera una cadena de N dígitos decimales aleatorios (para PINs), cada uno
 * elegido de forma independiente y criptográficamente segura.
 */
export function secureRandomDigits(count: number): string {
  let out = '';
  for (let i = 0; i < count; i++) {
    out += secureRandomInt(10).toString();
  }
  return out;
}

/**
 * Genera bytes aleatorios crudos, útiles para Hex/Base64/Base58/UUID.
 */
export function secureRandomBytes(length: number): Uint8Array {
  const cryptoObj = getCrypto();
  const bytes = new Uint8Array(length);
  cryptoObj.getRandomValues(bytes);
  return bytes;
}

/**
 * Genera un UUID v4 usando crypto.randomUUID() si existe, o un fallback
 * manual construido con secureRandomBytes (para máxima compatibilidad).
 */
export function secureUUIDv4(): string {
  const cryptoObj = getCrypto();
  if (typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }

  const bytes = secureRandomBytes(16);
  // Ajustar bits de versión (4) y variante (RFC 4122) según especificación UUID v4.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
