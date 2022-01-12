import { useCallback } from 'react';
import { UxModal } from '@ovh-ux/shell';
import { useCookies } from 'react-cookie';

const useCookieModal = (shell) => {
  const [cookies, setCookies] = useCookies(['MANAGER_TRACKING']);
  return useCallback((node) => {
    if (!node) return;

    const accept = (contentObject) => {
      setCookies('MANAGER_TRACKING', 1);
      shell.getPlugin('tracking').init();

      contentObject.hide();
    };

    const deny = (contentObject) => {
      setCookies('MANAGER_TRACKING', 0);
      contentObject.hide();
    };

    const modalContent = document.importNode(node, true).firstElementChild;
    const modalContentObj = new UxModal({
      content: modalContent,
      size: 'lg',
      className: 'manager-cookie-policy-banner',
    });

    // Checking if cookie exists
    if (cookies.MANAGER_TRACKING == null) {
      modalContentObj.show();
    }

    modalContent.querySelector('.accept').onclick = () => {
      accept(modalContentObj);
    };

    modalContent.querySelector('.deny').onclick = () => {
      deny(modalContentObj);
    };
  }, []);
};

export default useCookieModal;
