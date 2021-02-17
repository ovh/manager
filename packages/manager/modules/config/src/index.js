import _Environment from './environment';
import 'whatwg-fetch';

import {
  convertLanguageFromOVHToBCP47 as _convertLanguageFromOVHToBCP47,
  detectUserLocale as _detectUserLocale,
  findLanguage as _findLanguage,
} from './locale';

import {
  LANGUAGES as _LANGUAGES,
  localeStorageKey as _localeStorageKey,
} from './locale/locale.constants';

export const HOSTNAME_REGIONS = {
  'www.ovh.com': 'EU',
  'ca.ovh.com': 'CA',
  'us.ovhcloud.com': 'US',
};

export const Environment = _Environment;

export const convertLanguageFromOVHToBCP47 = _convertLanguageFromOVHToBCP47;
export const detectUserLocale = _detectUserLocale;
export const findLanguage = _findLanguage;
export const LANGUAGES = _LANGUAGES;
export const localeStorageKey = _localeStorageKey;

export const fetchConfiguration = (applicationName) => {
  let configurationURL = '/engine/2api/configuration';
  if (applicationName) {
    _Environment.setApplicationName(applicationName);
    configurationURL = `${configurationURL}?app=${encodeURIComponent(
      applicationName,
    )}`;
  }
  return fetch(configurationURL, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.assign(
          `/auth?action=disconnect&onsuccess=${encodeURIComponent(
            window.location.href,
          )}`,
        );
      }
      return response.json();
    })
    .then((config) => {
      _Environment.setRegion(config.region);
      _Environment.setUser(config.user);
      _Environment.setApplicationURLs(config.applicationURLs);
      _Environment.setUniverse(config.universe);
      return config;
    })
    .catch(() => ({
      region: HOSTNAME_REGIONS[window.location.hostname],
    }));
};

export default {
  convertLanguageFromOVHToBCP47,
  Environment,
  detectUserLocale,
  fetchConfiguration,
  findLanguage,
  LANGUAGES,
  localeStorageKey, // TODO(@antleblanc): Remove it on March 1, 2021.
};
