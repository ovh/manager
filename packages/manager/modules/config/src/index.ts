import { useReket } from '@ovh-ux/ovh-reket';
import Environment from './environment';
import { Region } from './environment/environment';

export const HOSTNAME_REGIONS: Record<string, Region> = {
  'www.ovh.com': Region.EU,
  'ca.ovh.com': Region.CA,
  'us.ovhcloud.com': Region.US,
};

export { default as Environment } from './environment';
export {
  convertLanguageFromOVHToBCP47,
  detectUserLocale,
  findLanguage,
  findAvailableLocale,
} from './locale';

export { LANGUAGES } from './locale/locale.constants';

export const isTopLevelApplication = () => window.top === window.self;

export const fetchConfiguration = async (applicationName: string): Promise<Environment> => {
  const environment = new Environment();
  const configRequestOptions = {
    requestType: 'aapi',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
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
      environment.setRegion(HOSTNAME_REGIONS[window.location.hostname]);
      return environment;
    });
};
