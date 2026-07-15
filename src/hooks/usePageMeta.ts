import { useEffect } from 'react';

interface PageMetaOptions {
  title: string;
  description?: string;
}

/**
 * Actualiza document.title y la meta description al montar una página.
 * La app es una SPA estática (sin SSR), así que esto cubre la navegación
 * dentro del cliente; las etiquetas iniciales servidas en index.html
 * (Open Graph, JSON-LD, canonical) siguen representando la página principal
 * para crawlers y previews de enlaces.
 */
export function usePageMeta({ title, description }: PageMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let descriptionTag: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;

    if (description) {
      descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) {
        previousDescription = descriptionTag.getAttribute('content');
        descriptionTag.setAttribute('content', description);
      }
    }

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription !== null) {
        descriptionTag.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}
