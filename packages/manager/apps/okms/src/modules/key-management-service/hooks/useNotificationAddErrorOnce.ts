import { useEffect, useRef } from 'react';

import { useNotifications } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';
import { isErrorResponse } from '@/common/utils/api/api';

/**
 * Add an error notification, only once, when the error comes in
 * Useful when you want to show a notification on a useQuery fetch error
 */
export const useNotificationAddErrorOnce = (error: Error | ErrorResponse | null) => {
  const { addError } = useNotifications();
  const errorAdded = useRef(false);

  useEffect(() => {
    if (!error || errorAdded.current) return;

    if (isErrorResponse(error)) {
      addError(error.response.data.message);
    } else {
      addError(error.message);
    }
    errorAdded.current = true;
  }, [error, addError]);
};
