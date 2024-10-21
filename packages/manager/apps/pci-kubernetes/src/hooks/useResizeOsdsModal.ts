import { useEffect } from 'react';
import { BreakPoints } from '@/types';

// FIXME with next version of Ods 18
/**
 * Hook to make a modal responsive based on the screen size.
 *
 * @param {string} size - The maximum size of the modal when the screen width is greater than `BreakPoints.SM`.
 *
 * @example
 * useResponsiveModal('500px');
 */
export const useResponsiveModal = (size) => {
  useEffect(() => {
    /**
     * Determines the styles to apply based on the screen width.
     *
     * @returns {Object} - The styles to apply.
     */
    const getStyles = () => {
      if (window.innerWidth > BreakPoints.SM) {
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
    /**
     * Applies the styles to a DOM element.
     *
     * @param {HTMLElement} element - The DOM element to which the styles will be applied.
     */
    const applyStyles = (element: HTMLElement) => {
      const styles = getStyles();
      Object.assign(element.style, styles);
    };
    /**
     * Mutation observer to detect changes in the DOM.
     */
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
