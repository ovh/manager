import { User } from './user';
import { ApplicationId, Application } from '../application';
import { Region } from './region.enum';

export type LangId = 'nl' | 'fr' | 'en' | 'de' | 'es' | 'it' | 'pl' | 'pt';

export type EnvMessage = {
  [key in LangId]: {
    description: string;
  };
};
export type Applications = {
  [appId in ApplicationId]: Application;
};
export interface IEnvironment {
  getRegion: () => Region;
  getUser: () => User;
  getApplicationURLs: () => Record<string, string>;
  getUniverse: () => string;
  getUserLocale: () => string;
  getUserLanguage: () => string;
  getApplicationName: () => string;
  getMessage: () => EnvMessage;
  getApplications: () => Applications;
  setRegion: (region: Region) => void;
  setUser: (user: User) => void;
  setUserLocale: (userLocale: string) => void;
  setVersion: (version: string) => void;
  setApplicationName: (name: string) => void;
  setUniverse: (universe: string) => void;
  setUniverseFromApplicationId: (applicationId: string) => void;
  setApplicationURLs: (applicationURLs: Record<string, string>) => void;
  setMessage: (message: EnvMessage) => void;
  setApplications: (applications: Applications) => void;
}
export declare class Environment implements IEnvironment {
  region: Region;

  userLocale: string;

  version: string;

  user: User;

  applicationName: string;

  universe: string;

  applicationURLs: Record<string, string>;

  message: EnvMessage;

  applications: Applications;

  constructor(config?: Environment);

  setRegion(region?: Region): void;

  getRegion(): Region;

  setUser(user: User): void;

  getUser(): User;

  setUserLocale(userLocale: string): void;

  getUserLocale(): string;

  getUserLanguage(): string;

  setVersion(version: string): void;

  getVersion(): string;

  setApplicationName(name: string): void;

  getApplicationName(): string;

  getApplication(): Application;

  setUniverse(universe: string): void;

  setUniverseFromApplicationId(applicationId: ApplicationId): string;

  getUniverse(): string;

  setApplicationURLs(applicationURLs: Record<string, string>): void;

  getApplicationURLs(): Record<string, string>;

  getApplicationURL(id: string): string;

  setMessage(message: EnvMessage): void;

  getMessage(): EnvMessage;

  getApplications(): Applications;

  setApplications(applications: Applications): void;
}
