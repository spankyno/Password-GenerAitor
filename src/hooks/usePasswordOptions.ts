import { useReducer } from 'react';
import type {
  CharacterSetOptions,
  ExclusionOptions,
  MinimumRequirements,
  PasswordOptions,
} from '@/types/password';
import { DEFAULT_PASSWORD_OPTIONS } from '@/lib/defaultOptions';

type Action =
  | { type: 'SET_LENGTH'; length: number }
  | { type: 'TOGGLE_CHARSET'; key: keyof CharacterSetOptions }
  | { type: 'TOGGLE_EXCLUSION'; key: 'excludeAmbiguous' | 'excludeSimilar' | 'avoidRepeatedChars' | 'avoidSequences' }
  | { type: 'SET_CUSTOM_EXCLUDED'; value: string }
  | { type: 'SET_MINIMUM'; key: keyof MinimumRequirements; value: number }
  | { type: 'TOGGLE_PRONOUNCEABLE' }
  | { type: 'APPLY_PRESET'; options: PasswordOptions }
  | { type: 'RESET' };

function reducer(state: PasswordOptions, action: Action): PasswordOptions {
  switch (action.type) {
    case 'SET_LENGTH':
      return { ...state, length: action.length };

    case 'TOGGLE_CHARSET': {
      const nextCharset: CharacterSetOptions = {
        ...state.charset,
        [action.key]: !state.charset[action.key],
      };
      // Evitar que las cuatro categorías queden desactivadas a la vez.
      const anyEnabled = Object.values(nextCharset).some(Boolean);
      return anyEnabled ? { ...state, charset: nextCharset } : state;
    }

    case 'TOGGLE_EXCLUSION': {
      const nextExclusions: ExclusionOptions = {
        ...state.exclusions,
        [action.key]: !state.exclusions[action.key],
      };
      return { ...state, exclusions: nextExclusions };
    }

    case 'SET_CUSTOM_EXCLUDED':
      return { ...state, exclusions: { ...state.exclusions, customExcluded: action.value } };

    case 'SET_MINIMUM':
      return {
        ...state,
        minimums: { ...state.minimums, [action.key]: Math.max(0, action.value) },
      };

    case 'TOGGLE_PRONOUNCEABLE':
      return { ...state, pronounceable: !state.pronounceable };

    case 'APPLY_PRESET':
      return action.options;

    case 'RESET':
      return DEFAULT_PASSWORD_OPTIONS;

    default:
      return state;
  }
}

export function usePasswordOptions(initial: PasswordOptions = DEFAULT_PASSWORD_OPTIONS) {
  const [options, dispatch] = useReducer(reducer, initial);
  return { options, dispatch };
}

export type PasswordOptionsAction = Action;
