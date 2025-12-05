import { aapi } from '@ovh-ux/manager-core-api';
import type { ApiError } from '@ovh-ux/manager-core-api';
import { getLogoutUrl } from '@ovh-ux/manager-core-sso';
import { getHeaders } from '@ovh-ux/request-tagger';

import Environment from './environment';
import { Region } from './environment/region.enum';

export const HOSTNAME_REGIONS: Record<string, Region> = {
  'manager.eu.ovhcloud.com': Region.EU,
  'manager.ca.ovhcloud.com': Region.CA,
  'manager.us.ovhcloud.com': Region.US,
};

export const RESTRICTED_DEFAULTS: Record<string, string> = {
  region: 'EU',
  publicURL: '/manager/restricted/',
};

export { Environment };
export * from './locale';

export * from './locale/locale.constants';
export * from './application';
export * from './environment';

export const isTopLevelApplication = () => window.top === window.self;

export type ConfigurationApiResponse = {
  region?: string;
  applications?: {
    restricted?: { publicURL?: string };
  };
  class?: string;
};

export type ErrorResponseData =
  | ConfigurationApiResponse
  | {
      message?: string;
      code?: string;
      details?: unknown;
    };

const updateEnvironment = (environment: Environment, data: Environment): Environment => {
  environment.setRegion(data.region);
  environment.setUser(data.user);
  environment.setApplicationURLs(data.applicationURLs);
  environment.setUniverse(data.universe || '');
  environment.setMessage(data.message);
  environment.setApplications(data.applications);
  return environment;
};

const handleUnauthorizedError = (): void => {
  if (!isTopLevelApplication()) {
    window.parent.postMessage({
      id: 'ovh-auth-redirect',
      url: getLogoutUrl(window.location.href),
    });
  }
};

const handleForbiddenError = (data: ConfigurationApiResponse): void => {
  const region = data?.region || RESTRICTED_DEFAULTS.region;
  const publicURL = data?.applications?.restricted?.publicURL || RESTRICTED_DEFAULTS.publicURL;
  const targetWindow = window.top || window;
  targetWindow.location.href = `${publicURL}?region=${region}`;
};

const handleMaintenanceError = (
  data: ConfigurationApiResponse,
  environment: Environment,
): never => {
  const errorObj = new Error('Server::InternalServerError::ApiUnreachableMaintenance');
  Object.assign(errorObj, { error: data, environment });
  throw errorObj;
};

const handleServerError = (
  data: ErrorResponseData,
  err: ApiError,
  environment: Environment,
): never => {
  const errorObj = new Error('Server Error');
  Object.assign(errorObj, {
    error: {
      message: data || err?.response?.statusText,
    },
    environment,
  });
  throw errorObj;
};

const handleErrorResponse = (
  err: ApiError & { response: { data: ConfigurationApiResponse } },
  environment: Environment,
): Environment => {
  const { status, data } = err?.response || {};

  switch (status) {
    case 401:
      handleUnauthorizedError();
      break;
    case 403:
      handleForbiddenError(data);
      break;
    case 500:
      if (data?.class === 'Server::InternalServerError::ApiUnreachableMaintenance') {
        handleMaintenanceError(data, environment);
      }
      break;
    default:
      if (status && status >= 500) {
        handleServerError(data, err, environment);
      }
  }

  environment.setRegion(HOSTNAME_REGIONS[window.location.hostname]);
  return environment;
};

export const fetchConfiguration = async (applicationName: string): Promise<Environment> => {
  const environment = new Environment();
  let configurationURL = '/configuration';
  if (applicationName) {
    environment.setApplicationName(applicationName);
    configurationURL = `${configurationURL}?app=${encodeURIComponent(applicationName)}`;
  }

  return aapi
    .get(configurationURL, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json',
        ...getHeaders('/engine/2api/configuration'),
      },
    })
    .then(({ data }: { data: Environment }) => {
      return updateEnvironment(environment, data);
    })
    .catch((err: ApiError & { response: { data: ConfigurationApiResponse } }) => {
      return handleErrorResponse(err, environment);
    });
};
