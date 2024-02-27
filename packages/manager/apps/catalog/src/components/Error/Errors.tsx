import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorBanner } from '@ovhcloud/manager-components';
import { sendErrorTracking, ErrorObject } from '@/utils/trackingError';

const Errors: React.FC<ErrorObject> = ({ error }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    sendErrorTracking({ error });
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
