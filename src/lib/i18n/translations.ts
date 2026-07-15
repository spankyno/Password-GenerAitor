export type Locale = 'es' | 'en';

export const translations = {
  es: {
    appTitle: 'Generación de contraseñas',
    appSubtitle: '100% local · sin servidores · sin registro',
    skipToContent: 'Saltar al contenido principal',

    presetsHeading: 'Presets rápidos',

    lengthLabel: 'Longitud',

    charsetHeading: 'Tipos de caracteres',
    charsetUppercase: 'Mayúsculas',
    charsetLowercase: 'Minúsculas',
    charsetNumbers: 'Números',
    charsetSymbols: 'Símbolos',

    exclusionsHeading: 'Exclusiones',
    exclusionAmbiguous: 'Excluir caracteres ambiguos',
    exclusionAmbiguousDesc: '0/O/o, 1/l/I, 5/S, 2/Z, 8/B, 6/G',
    exclusionSimilar: 'Excluir caracteres similares',
    exclusionSimilarDesc: 'Formas parecidas al escribir a mano',
    exclusionAvoidRepeated: 'Evitar caracteres repetidos',
    exclusionAvoidRepeatedDesc: 'Sin dos caracteres iguales consecutivos',
    exclusionAvoidSequences: 'Evitar secuencias',
    exclusionAvoidSequencesDesc: '123, abc, qwerty…',

    minimumsHeading: 'Reglas mínimas',
    minUppercase: 'Mín. mayúsculas',
    minLowercase: 'Mín. minúsculas',
    minNumbers: 'Mín. números',
    minSymbols: 'Mín. símbolos',

    actionRegenerate: 'Regenerar',
    actionCopy: 'Copiar',
    actionCopied: 'Copiado',
    actionFavorite: 'Favorito',
    actionFavorited: 'Favorita',
    actionShare: 'Compartir',
    actionHide: 'Ocultar',
    actionShow: 'Mostrar',

    patternsDetectedOne: 'Se detectó 1 patrón reconocible (subrayado).',
    patternsDetectedMany: 'Se detectaron {count} patrones reconocibles (subrayados).',

    privacyModeLabel: 'Modo privacidad',
    privacyModeHint: '(difumina tras unos segundos de inactividad)',

    profilesHeading: 'Perfiles guardados',
    profilesPrivacyNote:
      'Solo se guarda la configuración (longitud, tipos de caracteres, mínimos). Nunca se guarda ni se envía tu contraseña.',
    profilesNamePlaceholder: 'Ej. GitHub, Banco, NAS…',
    profilesSave: 'Guardar',
    profilesEmpty: 'Aún no tienes perfiles guardados en este dispositivo.',
    profilesNamePrompt: 'Ponle un nombre al perfil antes de guardarlo',
    profilesSaved: 'guardado',
    profilesApplied: 'aplicado',

    bulkHeading: 'Generación múltiple',
    bulkEmptyHint: 'Elige una cantidad para generar varias contraseñas a la vez con la configuración actual.',
    bulkExportLabel: 'Exportar como:',

    specializedHeading: 'Generadores especializados',
    tabPin: 'PIN',
    tabApiKey: 'API Key',

    settingsHeading: 'Configuración',
    themeLabel: 'Tema',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
    themeHighContrast: 'Alto contraste',
    languageLabel: 'Idioma',

    strengthLabel: 'Fortaleza',
    entropyBitsLabel: 'bits de entropía',
  },
  en: {
    appTitle: 'Password Generator',
    appSubtitle: '100% local · no servers · no sign-up',
    skipToContent: 'Skip to main content',

    presetsHeading: 'Quick presets',

    lengthLabel: 'Length',

    charsetHeading: 'Character types',
    charsetUppercase: 'Uppercase',
    charsetLowercase: 'Lowercase',
    charsetNumbers: 'Numbers',
    charsetSymbols: 'Symbols',

    exclusionsHeading: 'Exclusions',
    exclusionAmbiguous: 'Exclude ambiguous characters',
    exclusionAmbiguousDesc: '0/O/o, 1/l/I, 5/S, 2/Z, 8/B, 6/G',
    exclusionSimilar: 'Exclude similar characters',
    exclusionSimilarDesc: 'Shapes that look alike when handwritten',
    exclusionAvoidRepeated: 'Avoid repeated characters',
    exclusionAvoidRepeatedDesc: 'No two identical characters in a row',
    exclusionAvoidSequences: 'Avoid sequences',
    exclusionAvoidSequencesDesc: '123, abc, qwerty…',

    minimumsHeading: 'Minimum rules',
    minUppercase: 'Min. uppercase',
    minLowercase: 'Min. lowercase',
    minNumbers: 'Min. numbers',
    minSymbols: 'Min. symbols',

    actionRegenerate: 'Regenerate',
    actionCopy: 'Copy',
    actionCopied: 'Copied',
    actionFavorite: 'Favorite',
    actionFavorited: 'Favorited',
    actionShare: 'Share',
    actionHide: 'Hide',
    actionShow: 'Show',

    patternsDetectedOne: '1 recognizable pattern detected (underlined).',
    patternsDetectedMany: '{count} recognizable patterns detected (underlined).',

    privacyModeLabel: 'Privacy mode',
    privacyModeHint: '(blurs after a few seconds of inactivity)',

    profilesHeading: 'Saved profiles',
    profilesPrivacyNote:
      'Only the configuration is saved (length, character types, minimums). Your password itself is never saved or sent anywhere.',
    profilesNamePlaceholder: 'E.g. GitHub, Bank, NAS…',
    profilesSave: 'Save',
    profilesEmpty: "You don't have any saved profiles on this device yet.",
    profilesNamePrompt: 'Give the profile a name before saving it',
    profilesSaved: 'saved',
    profilesApplied: 'applied',

    bulkHeading: 'Bulk generation',
    bulkEmptyHint: 'Pick a count to generate several passwords at once with the current settings.',
    bulkExportLabel: 'Export as:',

    specializedHeading: 'Specialized generators',
    tabPin: 'PIN',
    tabApiKey: 'API Key',

    settingsHeading: 'Settings',
    themeLabel: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeHighContrast: 'High contrast',
    languageLabel: 'Language',

    strengthLabel: 'Strength',
    entropyBitsLabel: 'bits of entropy',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['es'];
