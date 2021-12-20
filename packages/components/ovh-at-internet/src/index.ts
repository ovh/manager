declare global {
  interface Window {
    ATInternet: {
      Tracker: {
        Tag: any;
      };
    };
  }
}

export { default } from './ovh-at-internet';
