import { Reket } from '@ovhcloud/reket-core';
import { AxiosReketClient } from '@ovhcloud/reket-axios-client';

import { DEFAULT_REQUEST_TYPES } from './constants';
import { redirectToLoginPage, redirectToLogoutPage } from './redirections';

export const ssoAuthHookFn = (error) => {
  const rejectedError = error;

  if (
    rejectedError.status === 403 &&
    (rejectedError.data.message === 'This session is forbidden' ||
      rejectedError.data.message === 'This session is invalid')
  ) {
    // consider a 401 if previous case is matched
    rejectedError.status = 401;
  }

  // Redirect on 401
  if (rejectedError.status === 401 && !rejectedError.config.preventLogout) {
    redirectToLogoutPage();
    return Promise.reject(rejectedError);
  }

  // If CODE 471 AKA Low-order session
  if (rejectedError.status === 471) {
    redirectToLoginPage();
    return Promise.reject(rejectedError);
  }

  // Reject the response
  return Promise.reject(rejectedError);
};

/**
 * Create an instance of Reket (configured with axios client)
 * and predefined hooks for sso auth (if configured)
 *
 * @param  {Boolean}              enableSsoAuth   Enable sso auth hooks.
 * @param  {String|Array<Object>} requestTypes    'default' in order to have default request
 *                                                types configured
 *                                                An Array of Object (with `type` and
 *                                                `urlPrefix` params)
 *
 * @return {Reket}          A Reket instance with predefined configuration.
 */
export const useReket = (enableSsoAuth = true, requestTypes = 'default') => {
  const reketInstance = new Reket();

  reketInstance.config.client.set(new AxiosReketClient());

  /* ----------  SSO Auth hooks configuration  ----------*/
  if (enableSsoAuth) {
    reketInstance.config.hooks.response.set(null, ssoAuthHookFn);
  }

  /* ----------  Request types configuration  ----------*/
  let requestTypesConfig = [];

  if (requestTypes === 'default') {
    requestTypesConfig = DEFAULT_REQUEST_TYPES;
  } else if (Array.isArray(requestTypes)) {
    requestTypesConfig = requestTypes;
  }

  reketInstance.config.requestTypes.add(requestTypesConfig);

  return reketInstance;
};

export default {
  useReket,
  ssoAuthHookFn,
};
