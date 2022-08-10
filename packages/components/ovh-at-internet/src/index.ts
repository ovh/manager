import { LegacyTrackingData } from './track';

declare global {
  interface Window {
    ATInternet: {
      Tracker: {
        Tag: ATInternetTag;
      };
    };
  }
}

export interface ATInternetTagOptions {
  ClientSideUserId: { clientSideMode: string };
  secure: boolean; // force HTTPS,
  disableCookie: boolean;
  mvTesting?: {
    set: (params: LegacyTrackingData) => void;
    add: (params: LegacyTrackingData) => void;
  };
  [key: string]: any;
}

export interface ATInternetTag {
  new (tag: ATInternetTagOptions): ATInternetTagOptions;
}

export { default } from './ovh-at-internet';
