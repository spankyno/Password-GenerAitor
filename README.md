# 🔐 Generación de contraseñas

Generador de contraseñas premium, **100% cliente, offline-first y enfocado en privacidad**. Sin backend, sin registro, sin analíticas, sin cookies. Todo ocurre en tu navegador.

## Características

- Generación instantánea (sin botón "Generar" obligatorio) usando exclusivamente `crypto.getRandomValues()`
- Longitud configurable de 4 a 128 caracteres, reglas mínimas por tipo de carácter, exclusión de caracteres ambiguos/similares, anti-repetición y anti-secuencias
- Panel de fortaleza completo: nivel, bits reales de entropía, tiempos de crackeo en 4 escenarios (online limitado, online, ataque doméstico, clúster GPU) con unidades siempre legibles (nunca notación científica)
- Detección local de patrones (secuencias, teclado, repeticiones, años, fechas, palabras/nombres comunes)
- Panel educativo con consejos dinámicos según la configuración actual
- Generación múltiple (10–50) con tabla, exportación a CSV/TXT/JSON
- Generadores especializados: PIN (4–8 dígitos, evita patrones débiles) y API Key/Token (Hex, Base64, Base58, UUID v4, charset personalizado)
- Perfiles guardados y presets rápidos (Máxima seguridad, Uso general, Wi-Fi, Banca, Desarrollo, Passphrase)
- Modo privacidad (difuminado automático por inactividad), indicador de composición, resaltado de duplicados al hover
- Temas claro/oscuro/alto contraste, i18n (ES/EN), accesible (WCAG AA), PWA instalable y funcional offline
- Content-Security-Policy estricta, sin trackers, sin llamadas de red

## Stack técnico

React 19 · TypeScript · Vite · Tailwind CSS v4 · Lucide Icons · Vitest · vite-plugin-pwa

## Arquitectura

```
src/
├── components/   # UI por dominio (generator, strength, bulk, specialized, profiles, education, shared)
├── hooks/        # usePasswordGenerator, usePasswordOptions, useClipboard, usePrivacyMode...
├── lib/          # crypto.ts (única puerta de entrada a la aleatoriedad), i18n, utils
├── utils/        # Funciones puras: passwordBuilder, entropy, patternDetection, presets...
├── services/     # exportService (CSV/TXT/JSON), storageService (perfiles en localStorage)
├── types/        # Tipos compartidos
├── context/      # Theme, Locale, Toast
└── pages/        # Home
```

Toda la lógica de generación, entropía y detección de patrones vive en funciones puras con tests dedicados (`*.test.ts`), independientes de React.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run test       # suite de tests (Vitest)
npm run typecheck  # chequeo de tipos
npm run lint       # oxlint
npm run build      # build de producción a /dist
npm run preview    # sirve /dist localmente
```

## Despliegue en Cloudflare Pages

1. Sube este repositorio a GitHub.
2. En Cloudflare Pages, crea un proyecto y conéctalo al repositorio.
3. Configuración de build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20 o superior
4. Cloudflare Pages detecta automáticamente `public/_headers` (cabeceras de seguridad: CSP, `X-Frame-Options`, `Permissions-Policy`, reglas de caché) sin configuración adicional.

No se requieren variables de entorno ni bases de datos: la app es completamente estática.

## Seguridad y privacidad

- Toda la generación usa `crypto.getRandomValues()`; nunca `Math.random()`
- Ninguna contraseña generada se guarda, registra en consola ni se envía a ningún servidor
- Los perfiles guardados en `localStorage` contienen únicamente la *configuración* (longitud, tipos de caracteres, mínimos), nunca una contraseña
- CSP estricta (`default-src 'self'`), sin scripts/estilos/fuentes externos
