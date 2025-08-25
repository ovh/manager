import { useLayoutEffect, useRef } from 'react';

/**
 * Hook to hide the OdsModal header as soon as it appears.
 */
export const useHideOdsModalHeader = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const modal = ref.current;
    const shadowRoot = modal?.shadowRoot;
    if (!shadowRoot) return undefined;

    // Try to hide immediately if already rendered
    const existingHeader = shadowRoot.querySelector<HTMLElement>(
      '.ods-modal__dialog__header',
    );
    if (existingHeader) {
      existingHeader.style.display = 'none';
      return undefined; // explicit, consistent return
    }

    // Otherwise, observe shadow DOM for when header appears
    const observer = new MutationObserver(() => {
      const newHeader = shadowRoot.querySelector<HTMLElement>(
        '.ods-modal__dialog__header',
      );
      if (newHeader) {
        newHeader.style.display = 'none';
        observer.disconnect(); // stop observing once header is hidden
      }
    });

    observer.observe(shadowRoot, { childList: true, subtree: true });

    return () => observer.disconnect(); // cleanup on unmount
  }, []);

  return ref;
};
