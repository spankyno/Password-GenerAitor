import { useEffect, useRef, useState } from 'react';

const INACTIVITY_DELAY_MS = 8000;
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'touchstart', 'click'] as const;

export function usePrivacyMode(enabled: boolean) {
  const [blurred, setBlurred] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setBlurred(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    function resetTimer() {
      setBlurred(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setBlurred(true), INACTIVITY_DELAY_MS);
    }

    resetTimer();
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetTimer);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [enabled]);

  return { blurred };
}
