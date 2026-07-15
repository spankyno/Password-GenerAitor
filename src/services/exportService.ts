import type { GeneratedPassword } from '@/types/password';

export type ExportFormat = 'csv' | 'txt' | 'json';

/**
 * Escapa un valor para una celda CSV según RFC 4180: si contiene coma,
 * comillas o salto de línea, se envuelve entre comillas dobles y se
 * duplican las comillas internas.
 */
function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCSV(items: GeneratedPassword[]): string {
  const header = ['#', 'password', 'strength_level', 'entropy_bits', 'favorite', 'created_at'];
  const rows = items.map((item, i) => [
    String(i + 1),
    escapeCsvField(item.value),
    item.strength.level,
    String(item.strength.entropyBits),
    item.isFavorite ? 'yes' : 'no',
    new Date(item.createdAt).toISOString(),
  ]);
  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function toTXT(items: GeneratedPassword[]): string {
  return items.map((item) => item.value).join('\n');
}

export function toJSON(items: GeneratedPassword[]): string {
  const serializable = items.map((item, i) => ({
    index: i + 1,
    password: item.value,
    strengthLevel: item.strength.level,
    entropyBits: item.strength.entropyBits,
    favorite: item.isFavorite,
    createdAt: new Date(item.createdAt).toISOString(),
  }));
  return JSON.stringify(serializable, null, 2);
}

export function serialize(items: GeneratedPassword[], format: ExportFormat): string {
  switch (format) {
    case 'csv':
      return toCSV(items);
    case 'txt':
      return toTXT(items);
    case 'json':
      return toJSON(items);
  }
}

const MIME_TYPES: Record<ExportFormat, string> = {
  csv: 'text/csv;charset=utf-8',
  txt: 'text/plain;charset=utf-8',
  json: 'application/json;charset=utf-8',
};

/**
 * Dispara la descarga de un archivo en el navegador, sin ningún request de
 * red: crea un Blob local, un object URL temporal, simula el click en un
 * <a> invisible y libera el URL inmediatamente después.
 */
export function downloadExport(items: GeneratedPassword[], format: ExportFormat): void {
  const content = serialize(items, format);
  const blob = new Blob([content], { type: MIME_TYPES[format] });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `contrasenas-${new Date().toISOString().slice(0, 10)}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
