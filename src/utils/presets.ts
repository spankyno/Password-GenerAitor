import type { PasswordOptions } from '@/types/password';
import { DEFAULT_PASSWORD_OPTIONS } from '@/lib/defaultOptions';

export interface Preset {
  id: string;
  label: string;
  options: PasswordOptions;
}

function withDefaults(overrides: Partial<PasswordOptions>): PasswordOptions {
  return {
    ...DEFAULT_PASSWORD_OPTIONS,
    ...overrides,
    charset: { ...DEFAULT_PASSWORD_OPTIONS.charset, ...overrides.charset },
    exclusions: { ...DEFAULT_PASSWORD_OPTIONS.exclusions, ...overrides.exclusions },
    minimums: { ...DEFAULT_PASSWORD_OPTIONS.minimums, ...overrides.minimums },
  };
}

export const QUICK_PRESETS: Preset[] = [
  {
    id: 'max-security',
    label: 'Máxima seguridad',
    options: withDefaults({
      length: 32,
      charset: { uppercase: true, lowercase: true, numbers: true, symbols: true },
      exclusions: {
        excludeAmbiguous: false,
        excludeSimilar: false,
        avoidRepeatedChars: true,
        avoidSequences: true,
        customExcluded: '',
      },
      minimums: { minUppercase: 3, minLowercase: 3, minNumbers: 3, minSymbols: 3 },
    }),
  },
  {
    id: 'general-use',
    label: 'Uso general',
    options: withDefaults({
      length: 16,
      charset: { uppercase: true, lowercase: true, numbers: true, symbols: true },
      exclusions: {
        excludeAmbiguous: true,
        excludeSimilar: false,
        avoidRepeatedChars: false,
        avoidSequences: true,
        customExcluded: '',
      },
    }),
  },
  {
    id: 'wifi',
    label: 'Wi-Fi',
    options: withDefaults({
      length: 20,
      charset: { uppercase: true, lowercase: true, numbers: true, symbols: false },
      exclusions: {
        excludeAmbiguous: true,
        excludeSimilar: true,
        avoidRepeatedChars: false,
        avoidSequences: true,
        customExcluded: '',
      },
    }),
  },
  {
    id: 'banking',
    label: 'Banca',
    options: withDefaults({
      length: 24,
      charset: { uppercase: true, lowercase: true, numbers: true, symbols: true },
      exclusions: {
        excludeAmbiguous: true,
        excludeSimilar: false,
        avoidRepeatedChars: true,
        avoidSequences: true,
        customExcluded: '',
      },
      minimums: { minUppercase: 2, minLowercase: 2, minNumbers: 2, minSymbols: 2 },
    }),
  },
  {
    id: 'development',
    label: 'Desarrollo',
    options: withDefaults({
      length: 40,
      charset: { uppercase: true, lowercase: true, numbers: true, symbols: true },
      exclusions: {
        excludeAmbiguous: false,
        excludeSimilar: false,
        avoidRepeatedChars: false,
        avoidSequences: false,
        customExcluded: '',
      },
    }),
  },
  {
    id: 'passphrase',
    label: 'Passphrase',
    options: withDefaults({
      length: 28,
      pronounceable: true,
    }),
  },
];
