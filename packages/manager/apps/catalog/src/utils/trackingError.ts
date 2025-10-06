import React from 'react';

import { useLocation } from 'react-router-dom';

import { ErrorMessage, TRACKING_LABELS } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { ErrorObject } from '@/components/Error/Errors';

export function getTypology(error: ErrorMessage) {
  if (error?.detail?.status && Math.floor(error.detail.status / 100) === 4) {
    return [401, 403].includes(error.detail.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

export function useSendErrorTracking({ error }: ErrorObject) {
  const { shell } = React.useContext(ShellContext);
  const location = useLocation();
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();

  React.useEffect(() => {
    env.then((response: any) => {
      const { applicationName } = response;
      const name = `errors::${getTypology(error as ErrorMessage)}::${applicationName}`;
      tracking.trackPage({
        name,
        level2: '81',
        type: 'navigation',
        page_category: location.pathname,
      });
    });
  }, []);
}
