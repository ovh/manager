import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ErrorBanner,
  ErrorMessage,
  TRACKING_LABELS,
} from '@ovh-ux/manager-react-components';

interface ErrorObject {
  [key: string]: any;
}

function getTrackingTypology(error: ErrorMessage) {
  if (error?.detail?.status && Math.floor(error.detail.status / 100) === 4) {
    return [401, 403].includes(error.detail.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

const Errors: React.FC<ErrorObject> = ({ error }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shell } = React.useContext(ShellContext);
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();

  React.useEffect(() => {
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
    <ErrorBanner
      error={error}
      onReloadPage={() => navigate(location.pathname, { replace: true })}
      onRedirectHome={() => navigate('/', { replace: true })}
    />
  );
};

export default Errors;
