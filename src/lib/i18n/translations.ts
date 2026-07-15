export type Locale = 'es' | 'en';

export const translations = {
  es: {
    appTitle: 'Password GenerAitor',
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

    navAbout: 'Acerca de',
    navHome: 'Inicio',

    footerCopyright: 'Aitor Sánchez Gutiérrez © 2026 · Reservados todos los derechos',
    footerAbout: 'Acerca de',
    footerContact: 'Contacto',
    footerBlog: 'Blog',
    footerMoreApps: 'Más apps',

    aboutTitle: 'Acerca de Password GenerAitor',
    aboutIntro:
      'Password GenerAitor es un generador de contraseñas premium, pensado para competir con los mejores generadores existentes sin sacrificar nunca tu privacidad.',
    aboutMissionHeading: 'El proyecto',
    aboutMissionBody:
      'Todo ocurre en tu navegador: no hay backend, no hay base de datos, no hay registro de usuario y ninguna contraseña generada sale nunca de tu dispositivo. La aplicación es completamente funcional sin conexión a internet una vez cargada.',
    aboutToolsHeading: 'Herramientas incluidas',
    aboutStackHeading: 'Stack tecnológico',
    aboutStackBody:
      'Construida con React 19, TypeScript, Vite y Tailwind CSS v4. Toda la lógica de generación, entropía y detección de patrones vive en funciones puras cubiertas por más de 60 tests. Progressive Web App instalable, con Content-Security-Policy estricta y sin dependencias de terceros para la generación criptográfica.',
    aboutAuthorHeading: 'Autor',
    aboutAuthorBody: 'Desarrollado por Aitor Sánchez Gutiérrez.',
    aboutBackHome: 'Volver al generador',
  },
  en: {
    appTitle: 'Password GenerAitor',
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

    navAbout: 'About',
    navHome: 'Home',

    footerCopyright: 'Aitor Sánchez Gutiérrez © 2026 · All rights reserved',
    footerAbout: 'About',
    footerContact: 'Contact',
    footerBlog: 'Blog',
    footerMoreApps: 'More apps',

    aboutTitle: 'About Password GenerAitor',
    aboutIntro:
      'Password GenerAitor is a premium password generator, built to compete with the best generators out there without ever compromising your privacy.',
    aboutMissionHeading: 'The project',
    aboutMissionBody:
      'Everything happens in your browser: no backend, no database, no sign-up, and no generated password ever leaves your device. The app is fully functional offline once loaded.',
    aboutToolsHeading: 'Included tools',
    aboutStackHeading: 'Tech stack',
    aboutStackBody:
      'Built with React 19, TypeScript, Vite and Tailwind CSS v4. All generation, entropy and pattern-detection logic lives in pure functions covered by 60+ tests. Installable Progressive Web App, with a strict Content-Security-Policy and no third-party dependencies for cryptographic generation.',
    aboutAuthorHeading: 'Author',
    aboutAuthorBody: 'Built by Aitor Sánchez Gutiérrez.',
    aboutBackHome: 'Back to the generator',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['es'];
