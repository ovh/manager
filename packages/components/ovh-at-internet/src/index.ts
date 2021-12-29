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
  [key: string]: any;
}

export interface ATInternetTag {
  new (tag: ATInternetTagOptions): ATInternetTagOptions;
}

export { default } from './ovh-at-internet';
