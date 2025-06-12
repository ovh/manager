import { aapi } from '@ovh-ux/manager-core-api';
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

export const fetchConfiguration = async (
  applicationName: string,
): Promise<Environment> => {
  const environment = new Environment();
  const configRequestOptions = {
    requestType: 'aapi',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
      ...getHeaders('/engine/2api/configuration'),
    },
    credentials: 'same-origin',
  };
  let configurationURL = '/configuration';
  if (applicationName) {
    environment.setApplicationName(applicationName);
    configurationURL = `${configurationURL}?app=${encodeURIComponent(
      applicationName,
    )}`;
  }
  return aapi
    .get(configurationURL, configRequestOptions)
    .then(({ data }) => data)
    .catch((err) => {
      if (err?.response?.status === 401 && !isTopLevelApplication()) {
        window.parent.postMessage({
          id: 'ovh-auth-redirect',
          url: `/auth?action=disconnect&onsuccess=${encodeURIComponent(
            window.location.href,
          )}`,
        });
      }
      if (err?.response?.status === 403) {
        const region =
          err?.response?.data?.region || RESTRICTED_DEFAULTS.region;
        const publicURL =
          err?.response?.data?.applications?.restricted?.publicURL ||
          RESTRICTED_DEFAULTS.publicURL;

        window.top.location.href = `${publicURL}?region=${region}`;
      }
      environment.setRegion(HOSTNAME_REGIONS[window.location.hostname]);
      if (
        err?.status === 500 &&
        err?.data.class ===
          'Server::InternalServerError::ApiUnreachableMaintenance'
      ) {
        const errorObj = {
          error: err.data,
          environment,
        };
        throw errorObj;
      }
      return environment;
    })
    .then((config: Environment) => {
      environment.setRegion(config.getRegion());
      environment.setUser(config.getUser());
      environment.setApplicationURLs(config.getApplicationURLs());
      environment.setUniverse(config.getUniverse());
      environment.setMessage(config.getMessage());
      environment.setApplications(config.getApplications());
      return environment;
    });
};
