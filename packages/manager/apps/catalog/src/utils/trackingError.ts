import { useShell } from '@ovh-ux/manager-react-core-application';
import { useLocation } from 'react-router-dom';
import { ErrorMessage, TRACKING_LABELS } from '@ovhcloud/manager-components';
import { Environment } from '@ovh-ux/manager-config/dist/types';
import { ErrorObject } from '@/components/Error/Errors';

export function getTypology(error: ErrorMessage) {
  if (error?.detail?.status && Math.floor(error.detail.status / 100) === 4) {
    return [401, 403].includes(error.detail.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

export function sendErrorTracking({ error }: ErrorObject) {
  const shell = useShell();
  const location = useLocation();
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();

  env.then((response: Environment) => {
    const { applicationName } = response;
    const name = `errors::${getTypology(
      error as ErrorMessage,
    )}::${applicationName}`;
    tracking.trackPage({
      name,
      level2: '81',
      type: 'navigation',
      page_category: location.pathname,
    });
  });
}
