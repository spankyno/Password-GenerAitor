import { describe, it, expect } from 'vitest';
import { toCSV, toTXT, toJSON, serialize } from './exportService';
import type { GeneratedPassword } from '@/types/password';
import { analyzeStrength } from '@/utils/entropy';

function makeItem(value: string, isFavorite = false): GeneratedPassword {
  return {
    id: 'id-' + value,
    value,
    createdAt: 1700000000000,
    isFavorite,
    strength: analyzeStrength(value, 70),
  };
}

describe('exportService', () => {
  const items = [makeItem('aB3$fG7!kL9@', true), makeItem('xQ2#zM8$pR5!')];

  it('toCSV genera una fila de cabecera y una por cada contraseña', () => {
    const csv = toCSV(items);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain('password');
    expect(lines[1]).toContain('aB3$fG7!kL9@');
    expect(lines[1]).toContain('yes');
    expect(lines[2]).toContain('no');
  });

  it('toCSV escapa correctamente valores con comas o comillas', () => {
    const trickyItem = makeItem('a,"b"c');
    const csv = toCSV([trickyItem]);
    expect(csv).toContain('"a,""b""c"');
  });

  it('toTXT genera una contraseña por línea, sin cabecera', () => {
    const txt = toTXT(items);
    const lines = txt.split('\n');
    expect(lines).toEqual(['aB3$fG7!kL9@', 'xQ2#zM8$pR5!']);
  });

  it('toJSON genera un array parseable con los campos esperados', () => {
    const json = toJSON(items);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toHaveProperty('password', 'aB3$fG7!kL9@');
    expect(parsed[0]).toHaveProperty('favorite', true);
    expect(parsed[0]).toHaveProperty('strengthLevel');
  });

  it('serialize delega en el formato correcto', () => {
    expect(serialize(items, 'csv')).toBe(toCSV(items));
    expect(serialize(items, 'txt')).toBe(toTXT(items));
    expect(serialize(items, 'json')).toBe(toJSON(items));
  });
});
