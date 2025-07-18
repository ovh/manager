import { useReket } from '@ovh-ux/ovh-reket';
import { getHeaders } from '@ovh-ux/request-tagger';
import Environment, { User } from './environment';
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
  const Reket = useReket(true);

  return Reket.get(configurationURL, configRequestOptions)
    .then((config: Environment) => {
      environment.setRegion(config.region);
      environment.setUser(config.user);
      environment.setApplicationURLs(config.applicationURLs);
      environment.setUniverse(config.universe);
      environment.setMessage(config.message);
      environment.setApplications(config.applications);
      return environment;
    })
    .catch((err) => {
      if (err && err.status === 401 && !isTopLevelApplication()) {
        window.parent.postMessage({
          id: 'ovh-auth-redirect',
          url: `/auth?action=disconnect&onsuccess=${encodeURIComponent(
            window.location.href,
          )}`,
        });
      }
      if (err?.status === 403) {
        const region = err?.data?.region || RESTRICTED_DEFAULTS.region;
        const publicURL =
          err?.data?.applications?.restricted?.publicURL ||
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
      if (err?.status >= 500) {
        const errorObj = {
          error: {
            message: err?.response?.data || err?.response?.statusText,
          },
          environment,
        };
        throw errorObj;
      }
      return environment;
    });
};
