export type ApplicationId = string;

export interface Container {
  enabled: boolean;
  isDefault: boolean;
  path: string;
  hash?: string;
  hashes?: string[];
  containerURL: string;
  fallbackApp?: string;
}

export interface Application {
  universe: string;
  url: string;
  container: Container;
  publicURL?: string;
}
