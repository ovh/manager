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

export interface Application {
  universe: string;
  url: string;
}
