import { useCallback } from 'react';
import { UxModal } from '@ovh-ux/shell';
import { useCookies } from 'react-cookie';
import { useApplication } from '@/context';

const trackingEnabled = process.env.NODE_ENV === 'production';

const useCookieModal = (shell) => {
  const [cookies, setCookies] = useCookies(['MANAGER_TRACKING']);
  const { environment } = useApplication();

  return useCallback((node) => {
    if (!node) return;
    const trackingPlugin = shell.getPlugin('tracking');

    const accept = (contentObject) => {
      setCookies('MANAGER_TRACKING', 1);
      trackingPlugin.setEnabled(trackingEnabled);
      trackingPlugin.setRegion(environment.getRegion());
      trackingPlugin.init();

      contentObject.hide();
    };

    const deny = (contentObject) => {
      setCookies('MANAGER_TRACKING', 0);
      trackingPlugin.setEnabled(trackingEnabled);
      trackingPlugin.clearTrackQueue();
      trackingPlugin.init();

      trackingPlugin.trackClick({
        type: 'action',
        name: 'cookie-banner-manager::decline',
      });

      trackingPlugin.setEnabled(false);

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
    } else if (cookies.MANAGER_TRACKING === '1') {
      trackingPlugin.setEnabled(trackingEnabled);
      trackingPlugin.init();
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
