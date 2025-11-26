import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { ErrorBanner, ErrorMessage, TRACKING_LABELS } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { urls } from '@/routes/routes.constant';

interface ErrorObject {
  [key: string]: unknown;
}

function getTrackingTypology(error: ErrorMessage) {
  const status = (error?.detail as { status: number } | undefined)?.status;
  if (status && typeof status === 'number' && Math.floor(status / 100) === 4) {
    return [401, 403].includes(status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

const Errors: React.FC<ErrorObject> = ({ error }: { error: unknown }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shell } = React.useContext(ShellContext);
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();

  React.useEffect(() => {
    env.then((response: { applicationName: string }) => {
      const { applicationName } = response;
      const name = `errors::${getTrackingTypology(error)}::${applicationName}`;
      tracking.trackPage({
        name,
        level2: '81',
        type: 'navigation',
        page_category: location.pathname,
      });
    });
  }, [env, error, location.pathname, tracking]);

  return (
    <ErrorBanner
      error={error}
      onReloadPage={() => navigate(location.pathname, { replace: true })}
      onRedirectHome={() => navigate(urls.root, { replace: true })}
    />
  );
};

export default Errors;
