import { MVTestingData, MVTestingVariables } from './config';

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
    set: (params: MVTestingData) => void;
    add: (params: MVTestingVariables) => void;
  };
  [key: string]: any;
}

export interface ATInternetTag {
  new (tag: ATInternetTagOptions): ATInternetTagOptions;
}

export { default } from './ovh-at-internet';
