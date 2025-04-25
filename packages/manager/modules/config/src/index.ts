import { aapi } from '@ovh-ux/manager-core-api';
import type { ApiError } from '@ovh-ux/manager-core-api';
import { getHeaders } from '@ovh-ux/request-tagger';

import Environment from './environment';
import { Region } from './environment/region.enum';

export const HOSTNAME_REGIONS: Record<string, Region> = {
  'www.ovh.com': Region.EU,
  'ca.ovh.com': Region.CA,
  'us.ovhcloud.com': Region.US,
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
      environment.setRegion(data.region);
      environment.setUser(data.user);
      environment.setApplicationURLs(data.applicationURLs);
      environment.setUniverse(data.universe || '');
      environment.setMessage(data.message);
      environment.setApplications(data.applications);
      return environment;
    })
    .catch(
      (
        err: ApiError & {
          response: {
            data: ConfigurationApiResponse;
          };
        },
      ) => {
        const { status, data } = err?.response || {};

        if (status === 401 && !isTopLevelApplication()) {
          window.parent.postMessage({
            id: 'ovh-auth-redirect',
            url: `/auth?action=disconnect&onsuccess=${encodeURIComponent(window.location.href)}`,
          });
        }
        if (status === 403) {
          const region = data?.region || RESTRICTED_DEFAULTS.region;
          const publicURL =
            data?.applications?.restricted?.publicURL || RESTRICTED_DEFAULTS.publicURL;
          if (window.top) {
            window.top.location.href = `${publicURL}?region=${region}`;
          } else {
            window.location.href = `${publicURL}?region=${region}`;
          }
        }
        environment.setRegion(HOSTNAME_REGIONS[window.location.hostname]);
        if (
          status === 500 &&
          data?.class === 'Server::InternalServerError::ApiUnreachableMaintenance'
        ) {
          const errorObj = new Error('Server::InternalServerError::ApiUnreachableMaintenance');
          Object.assign(errorObj, { error: data, environment });
          throw errorObj;
        }
        if (status && status >= 500) {
          const errorObj = new Error('Server Error');
          Object.assign(errorObj, {
            error: {
              message: data || err?.response?.statusText,
            },
            environment,
          });
          throw errorObj;
        }
        return environment;
      },
    );
};
