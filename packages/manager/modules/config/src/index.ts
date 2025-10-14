import { getLogoutUrl } from '@ovh-ux/manager-core-sso';
import { useReket } from '@ovh-ux/ovh-reket';
import { getHeaders } from '@ovh-ux/request-tagger';

import { Application } from './application';
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

interface ApiError {
  status: number;
  data?: {
    region?: string;
    applications?: {
      restricted?: { publicURL?: string };
    };
    class?: string;
  };
  response?: {
    statusText?: string;
    data?: unknown;
  };
}

const getNewUrl = (appName = '', currentValue = '', region: 'EU' | 'CA' | 'US') => {
  if (appName === 'sunrise') {
    return currentValue;
  }

  const telecomApps = ['telecom', 'telephony', 'freefax', 'overthebox', 'pack-xdsl', 'sms'];

  if (telecomApps.indexOf(appName) !== -1) {
    return currentValue.replace('www.ovhtelecom.fr/manager', 'manager.eu.ovhcloud.com');
  }

  const oldDomains = {
    EU: 'www.ovh.com/manager',
    CA: 'ca.ovh.com/manager',
    US: 'us.ovhcloud.com/manager',
  };

  return currentValue.replace(oldDomains[region], `manager.${region.toLowerCase()}.ovhcloud.com`);
};

// TODO: Temporarily update the domains of µ-app URLs as they are still pointing to the old ones from BFF. To clean this method after BFF deployment
const updateDomain = (configObj: Environment) => {
  const { region } = configObj;
  Object.entries(configObj.applicationURLs).forEach(([key, value]) => {
    configObj.applicationURLs[key] = getNewUrl(key, value, region);
  });
  Object.entries(configObj.applications).forEach(([key, value]) => {
    (configObj.applications[key] as Application).url = getNewUrl(key, value.url, region);
    if ((configObj.applications[key] as Application).publicURL) {
      (configObj.applications[key] as Application).publicURL = getNewUrl(
        key,
        value.publicURL,
        region,
      );
    }
  });
};

export const fetchConfiguration = async (applicationName: string): Promise<Environment> => {
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
    configurationURL = `${configurationURL}?app=${encodeURIComponent(applicationName)}`;
  }
  const Reket = useReket(true);

  return Reket.get<Environment>(configurationURL, configRequestOptions)
    .then((config) => {
      updateDomain(config);
      environment.setRegion(config.region);
      environment.setUser(config.user);
      environment.setApplicationURLs(config.applicationURLs);
      environment.setUniverse(config.universe || '');
      environment.setMessage(config.message);
      environment.setApplications(config.applications);
      return environment;
    })
    .catch((exception) => {
      const apiError = exception as ApiError;
      if (apiError && apiError.status === 401 && !isTopLevelApplication()) {
        window.parent.postMessage({
          id: 'ovh-auth-redirect',
          url: getLogoutUrl(window.location.href),
        });
      }
      if (apiError?.status === 403) {
        const region = apiError?.data?.region || RESTRICTED_DEFAULTS.region;
        const publicURL =
          apiError?.data?.applications?.restricted?.publicURL || RESTRICTED_DEFAULTS.publicURL;
        if (window?.top) {
          window.top.location.href = `${publicURL}?region=${region}`;
        }
      }
      environment.setRegion(HOSTNAME_REGIONS[window.location.hostname]);
      if (
        apiError?.status === 500 &&
        apiError?.data?.class === 'Server::InternalServerError::ApiUnreachableMaintenance'
      ) {
        const errorObj = {
          error: apiError.data,
          environment,
        };
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw errorObj;
      }
      if (apiError?.status >= 500) {
        const errorObj = {
          error: {
            message: apiError?.response?.data || apiError?.response?.statusText,
          },
          environment,
        };
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw errorObj;
      }
      return environment;
    });
};
