import React, { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

// @TODO: Fix this when muk export it correclty
// import { TRACKING_LABELS } from '@ovh-ux/manager-react-components';
import { useShell } from '@ovh-ux/manager-react-core-application';
import { Error as ErrorComponent, ErrorMessage, ErrorProps } from '@ovh-ux/muk';

function getTrackingTypology(error: ErrorMessage) {
  if (error?.status && Math.floor(error.status / 100) === 4) {
    return [401, 403].includes(error.status) ? 'UNAUTHORIZED' : 'SERVICE_NOT_FOUND';
  }
  return 'PAGE_LOAD';
}

export const Error: React.FC<ErrorProps> = ({ error }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const shell = useShell();
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();

  useEffect(() => {
    env.then((response) => {
      const { applicationName } = response;
      const name = `errors::${getTrackingTypology(error)}::${applicationName}`;
      tracking.trackPage({
        name,
        level2: '81',
        type: 'navigation',
        page_category: location.pathname,
      });
    });
  }, []);

  return (
    <ErrorComponent
      error={error}
      onReloadPage={() => navigate(location.pathname, { replace: true })}
      onRedirectHome={() => navigate('/', { replace: true })}
    />
  );
};

export default Error;
