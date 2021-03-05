import { ALLOWED_REGIONS, DEFAULT_REGION } from './environment.constants';
import {
  detectUserLocale,
  findAvailableLocale,
  saveUserLocale,
} from '../locale';

export default class Environment {
  constructor() {
    this.region = DEFAULT_REGION;
    this.userLocale = findAvailableLocale(detectUserLocale(), this.region);
    this.version = null;
    this.user = {};
    this.applicationName = '';
    this.universe = '';
    this.applicationURLs = {};
    this.message = {};
  }

  setRegion(region = DEFAULT_REGION) {
    if (!ALLOWED_REGIONS.includes(region)) {
      throw new Error(`Region ${region} is not allowed`);
    }
    this.region = region;
  }

  getRegion() {
    return this.region;
  }

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  setUserLocale(userLocale) {
    const locale = findAvailableLocale(userLocale, this.getRegion());
    saveUserLocale(locale);
    this.userLocale = locale;
  }

  getUserLocale() {
    return this.userLocale;
  }

  getUserLanguage() {
    return this.userLocale.split('_')[0];
  }

  setVersion(version) {
    this.version = version;
  }

  getVersion() {
    return this.version;
  }

  setApplicationName(name) {
    this.applicationName = name;
  }

  getApplicationName() {
    return this.applicationName;
  }

  setUniverse(universe) {
    this.universe = universe;
  }

  getUniverse() {
    return this.universe;
  }

  setApplicationURLs(applicationURLs) {
    this.applicationURLs = applicationURLs;
  }

  getApplicationURLs() {
    return this.applicationURLs;
  }

  getApplicationURL(id) {
    return this.applicationURLs[id];
  }

  setMessage(message) {
    this.message = message;
  }

  getMessage() {
    return this.message;
  }
}
