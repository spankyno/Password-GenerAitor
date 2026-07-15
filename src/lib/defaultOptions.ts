import type { PasswordOptions } from '@/types/password';

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 20,
  charset: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  },
  exclusions: {
    excludeAmbiguous: false,
    excludeSimilar: false,
    avoidRepeatedChars: false,
    avoidSequences: false,
    customExcluded: '',
  },
  minimums: {
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  },
  pronounceable: false,
};
