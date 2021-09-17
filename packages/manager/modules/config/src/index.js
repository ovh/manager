import { useReket } from '@ovh-ux/ovh-reket';
import _Environment from './environment';
import initIframeApplication from './iframe';

import {
  convertLanguageFromOVHToBCP47 as _convertLanguageFromOVHToBCP47,
  detectUserLocale as _detectUserLocale,
  findLanguage as _findLanguage,
  findAvailableLocale as _findAvailableLocale,
} from './locale';

import { LANGUAGES as _LANGUAGES } from './locale/locale.constants';

export const HOSTNAME_REGIONS = {
  'www.ovh.com': 'EU',
  'ca.ovh.com': 'CA',
  'us.ovhcloud.com': 'US',
};

export const Environment = _Environment;

export const convertLanguageFromOVHToBCP47 = _convertLanguageFromOVHToBCP47;
export const detectUserLocale = _detectUserLocale;
export const findLanguage = _findLanguage;
export const findAvailableLocale = _findAvailableLocale;
export const LANGUAGES = _LANGUAGES;

export const isTopLevelApplication = () => window.top === window.self;

export const fetchConfiguration = (applicationName) => {
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
    .then((config) => {
      environment.setRegion(config.region);
      environment.setUser(config.user);
      environment.setApplicationURLs(config.applicationURLs);
      environment.setUniverse(config.universe);
      environment.setMessage(config.message);
      if (!isTopLevelApplication()) {
        initIframeApplication(environment);
      }
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
      return {
        region: HOSTNAME_REGIONS[window.location.hostname],
      };
    });
};

export default {
  convertLanguageFromOVHToBCP47,
  Environment,
  detectUserLocale,
  fetchConfiguration,
  findLanguage,
  findAvailableLocale,
  isTopLevelApplication,
  LANGUAGES,
};
