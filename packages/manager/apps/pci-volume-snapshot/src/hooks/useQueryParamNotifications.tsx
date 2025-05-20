import { useNotifications } from '@ovh-ux/manager-react-components';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

type NotificationType = 'success' | 'error';

export const useQueryParamNotifications = () => {
  const { addError, addSuccess } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams?.get('notificationType') as NotificationType | null;
  const message = searchParams?.get('notificationMsg');

  useEffect(() => {
    if (!type || !message) {
      return;
    }

    const sanitizedMsg = DOMPurify.sanitize(message);

    switch (type) {
      case 'success':
        addSuccess(
          <div dangerouslySetInnerHTML={{ __html: sanitizedMsg }}></div>,
        );
        break;
      case 'error':
        addError(
          <div dangerouslySetInnerHTML={{ __html: sanitizedMsg }}></div>,
        );
        break;
      default:
        break;
    }

    setSearchParams(
      (prev) => {
        prev.delete('notificationType');
        prev.delete('notificationMsg');
        return prev;
      },
      { replace: true },
    );
  }, [type, message, setSearchParams, addSuccess, addError]);
};
