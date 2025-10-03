import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { AxiosError } from 'axios';

import { ErrorBanner, ErrorMessage } from '@ovh-ux/manager-react-components';

import { useSendErrorTracking } from '@/utils/trackingError';

export interface ErrorObject {
  error: AxiosError<unknown, unknown> | ErrorMessage;
}

const Errors: React.FC<ErrorObject> = ({ error }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useSendErrorTracking({ error });

  return (
    <ErrorBanner
      error={error}
      onReloadPage={() => navigate(location.pathname, { replace: true })}
      onRedirectHome={() => navigate('/', { replace: true })}
    />
  );
};

export default Errors;
