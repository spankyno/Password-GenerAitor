import { useCallback, useEffect, useRef, useState } from 'react';

export type AutoClearDelay = 0 | 5 | 10 | 30 | 60;

interface UseClipboardParams {
  /** 0 = desactivado. El usuario debe activarlo explícitamente (nunca por defecto). */
  autoClearSeconds: AutoClearDelay;
  onCopied?: () => void;
}

export function useClipboard({ autoClearSeconds, onCopied }: UseClipboardParams) {
  const [justCopied, setJustCopied] = useState(false);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (value: string) => {
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Fallback para navegadores sin permisos/Clipboard API (ej. contexto no seguro)
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
        } finally {
          document.body.removeChild(textarea);
        }
      }

      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate(15);
      }

      setJustCopied(true);
      onCopied?.();

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => setJustCopied(false), 2000);

      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
      if (autoClearSeconds > 0) {
        clearTimeoutRef.current = setTimeout(async () => {
          try {
            const current = await navigator.clipboard.readText();
            // Solo borramos si el portapapeles sigue conteniendo lo que copiamos,
            // para no borrar algo distinto que el usuario haya copiado después.
            if (current === value) {
              await navigator.clipboard.writeText('');
            }
          } catch {
            // Si no se puede leer el portapapeles (permisos), no forzamos el borrado.
          }
        }, autoClearSeconds * 1000);
      }
    },
    [autoClearSeconds, onCopied]
  );

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  return { copy, justCopied };
}
