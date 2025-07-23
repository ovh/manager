import { RefObject, useEffect } from 'react';

// @TODO delete this hook when ods modal overflow is fixed
export function useOdsModalOverflowHack(modalRef: RefObject<HTMLOdsModalElement>) {
  /* The following useEffect is a hack to allow the OdsSelect overflowing
   * in the OdsModal thus allowing the user to select an item even for long lists.
   * This hack can be removed once this issue is fixed on ods side, and this
   * version of ods is available in pci-common & manager-react-components.
   */
  useEffect(() => {
    if (!modalRef.current) return;
    const { shadowRoot } = modalRef.current;
    if (!shadowRoot?.querySelector('style')) {
      const style = document.createElement('style');
      style.innerHTML = `
          .ods-modal__dialog { overflow: visible !important; }
          .ods-modal__dialog__content { overflow: visible !important; }
        `;
      shadowRoot?.appendChild(style);
    }
  }, [modalRef.current]);
}
