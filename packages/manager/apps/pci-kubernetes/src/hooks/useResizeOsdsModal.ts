import { useEffect } from 'react';

export const useResponsiveModal = (size) => {
  useEffect(() => {
    const getStyles = () => {
      if (window.innerWidth > 768) {
        return {
          maxWidth: size,
          minWidth: 'auto',
        };
      }
      return {
        maxWidth: 'inherit',
        minWidth: 'inherit',
      };
    };

    const applyStyles = (element: HTMLElement) => {
      const styles = getStyles();
      Object.assign(element.style, styles);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          const popup = document
            .querySelector('osds-modal')
            ?.shadowRoot?.querySelector(
              'dialog > div > div.popup',
            ) as HTMLElement;

          if (popup) {
            applyStyles(popup);
            window.addEventListener('resize', () => applyStyles(popup));
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const initialPopup = document
      .querySelector('osds-modal')
      ?.shadowRoot?.querySelector('dialog > div > div.popup') as HTMLElement;

    if (initialPopup) {
      applyStyles(initialPopup);
      window.addEventListener('resize', () => applyStyles(initialPopup));
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', () => applyStyles(initialPopup));
    };
  }, []);
};
