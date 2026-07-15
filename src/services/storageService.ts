import type { PasswordOptions } from '@/types/password';
import { secureUUIDv4 } from '@/lib/crypto';

const STORAGE_KEY = 'pwgen:profiles:v1';

export interface SavedProfile {
  id: string;
  name: string;
  options: PasswordOptions;
  createdAt: number;
}

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function listProfiles(): SavedProfile[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SavedProfile[];
  } catch {
    // Datos corruptos o localStorage inaccesible: no rompemos la app, solo devolvemos vacío.
    return [];
  }
}

function persist(profiles: SavedProfile[]): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // Cuota excedida u otro error de escritura: no propagamos, el llamador decide si avisar.
  }
}

export function saveProfile(name: string, options: PasswordOptions): SavedProfile {
  const profile: SavedProfile = {
    id: secureUUIDv4(),
    name: name.trim() || 'Sin nombre',
    options,
    createdAt: Date.now(),
  };
  const profiles = [...listProfiles(), profile];
  persist(profiles);
  return profile;
}

export function deleteProfile(id: string): void {
  const profiles = listProfiles().filter((p) => p.id !== id);
  persist(profiles);
}
