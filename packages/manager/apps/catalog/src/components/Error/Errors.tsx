import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { AxiosError } from 'axios';

import { Error, ErrorMessage } from '@ovh-ux/muk';
import { formatError } from '@/helpers/error.helper';

export interface ErrorObject {
  error: AxiosError<unknown, unknown> | ErrorMessage;
}

const Errors: React.FC<ErrorObject> = ({ error }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorObject = formatError(error);

  return (
    <Error
      error={errorObject}
      onReloadPage={() => navigate(location.pathname, { replace: true })}
      onRedirectHome={() => navigate('/', { replace: true })}
    />
  );
};

export default Errors;
