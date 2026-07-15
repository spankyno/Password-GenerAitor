import { describe, it, expect, beforeEach } from 'vitest';
import { saveProfile, listProfiles, deleteProfile } from './storageService';
import { DEFAULT_PASSWORD_OPTIONS } from '@/lib/defaultOptions';

describe('storageService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('empieza sin perfiles', () => {
    expect(listProfiles()).toEqual([]);
  });

  it('guarda un perfil y lo recupera con listProfiles', () => {
    const saved = saveProfile('GitHub', DEFAULT_PASSWORD_OPTIONS);
    const profiles = listProfiles();
    expect(profiles).toHaveLength(1);
    expect(profiles[0].id).toBe(saved.id);
    expect(profiles[0].name).toBe('GitHub');
    expect(profiles[0].options).toEqual(DEFAULT_PASSWORD_OPTIONS);
  });

  it('usa "Sin nombre" si el nombre viene vacío', () => {
    const saved = saveProfile('   ', DEFAULT_PASSWORD_OPTIONS);
    expect(saved.name).toBe('Sin nombre');
  });

  it('elimina un perfil por id', () => {
    const a = saveProfile('A', DEFAULT_PASSWORD_OPTIONS);
    saveProfile('B', DEFAULT_PASSWORD_OPTIONS);
    deleteProfile(a.id);
    const profiles = listProfiles();
    expect(profiles).toHaveLength(1);
    expect(profiles[0].name).toBe('B');
  });

  it('no revienta si localStorage contiene JSON corrupto', () => {
    window.localStorage.setItem('pwgen:profiles:v1', '{not valid json');
    expect(listProfiles()).toEqual([]);
  });
});
