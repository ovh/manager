import { ALLOWED_REGIONS, DEFAULT_REGION } from './environment.constants';
import {
  detectUserLocale,
  findAvailableLocale,
  saveUserLocale,
  LangId,
} from '../locale';
import { User } from './user';

export type EnvMessage = {
  [key in LangId]: { description: string };
};

export const enum Region {
  US = 'US',
  CA = 'CA',
  EU = 'EU',
}

export interface IEnvironment {
  getRegion: () => Region;
  getUser: () => User;
  getApplicationURLs: () => Record<string, string>;
  getUniverse: () => string;
  getUserLocale: () => string;
  getUserLanguage: () => string;
  getApplicationName: () => string;
  getMessage: () => EnvMessage;

  setRegion: (region: Region) => void;
  setUser: (user: User) => void;
  setUserLocale: (userLocale: string) => void;
  setVersion: (version: string) => void;
  setApplicationName: (name: string) => void;
  setUniverse: (universe: string) => void;
  setApplicationURLs: (applicationURLs: Record<string, string>) => void;
  setMessage: (message: EnvMessage) => void;
}
export class Environment implements IEnvironment {
  // TODO: After the addition of reket, we had to remove the private attribute
  // This should be refactored to private and only use accessors.
  region: Region;

  userLocale: string;

  version: string;

  user: User;

  applicationName: string;

  universe: string;

  applicationURLs: Record<string, string>;

  message: EnvMessage;

  constructor() {
    this.region = DEFAULT_REGION as Region;
    this.userLocale = findAvailableLocale(detectUserLocale(), this.region);
    this.version = null;
    this.user = {} as User;
    this.applicationName = '';
    this.universe = null;
    this.applicationURLs = {};
    this.message = {} as EnvMessage;
  }

  setRegion(region = DEFAULT_REGION): void {
    if (!ALLOWED_REGIONS.includes(region)) {
      throw new Error(`Region ${region} is not allowed`);
    }
    this.region = region as Region;
  }

  getRegion(): Region {
    return this.region;
  }

  setUser(user: User): void {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  setUserLocale(userLocale: string): void {
    const locale = findAvailableLocale(userLocale, this.getRegion());
    saveUserLocale(locale);
    this.userLocale = locale;
  }

  getUserLocale(): string {
    return this.userLocale;
  }

  getUserLanguage(): string {
    return this.userLocale.split('_')[0];
  }

  setVersion(version: string): void {
    this.version = version;
  }

  getVersion(): string {
    return this.version;
  }

  setApplicationName(name: string): void {
    this.applicationName = name;
  }

  getApplicationName(): string {
    return this.applicationName;
  }

  setUniverse(universe: string): void {
    this.universe = universe;
  }

  getUniverse(): string {
    return this.universe;
  }

  setApplicationURLs(applicationURLs: Record<string, string>): void {
    this.applicationURLs = applicationURLs;
  }

  getApplicationURLs(): Record<string, string> {
    return this.applicationURLs;
  }

  getApplicationURL(id: string): string {
    return this.applicationURLs[id];
  }

  setMessage(message: EnvMessage): void {
    this.message = message;
  }

  getMessage(): EnvMessage {
    return this.message;
  }
}
