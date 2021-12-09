export type ApplicationId =
  | 'billing'
  | 'cloud'
  | 'dedicated'
  | 'exchange'
  | 'freefax'
  | 'hub'
  | 'office'
  | 'overthebox'
  | 'pack-xdsl'
  | 'public-cloud'
  | 'sharepoint'
  | 'sms'
  | 'telecom'
  | 'telephony'
  | 'user'
  | 'web';

export interface Container {
  enabled: boolean;
  isDefault: boolean;
  path: string;
  containerURL: string;
}

export interface Application {
  universe: string;
  url: string;
  container?: Container; // @TODO: remove nullable when 2API applications will be prodded
}
