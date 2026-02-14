import { APP_NAME } from './App.constants';

export const LEVEL2 = {
  EU: {
    config: {
      level2: '140',
    },
  },
  CA: {
    config: {
      level2: '140',
    },
  },
  US: {
    config: {
      level2: '140',
    },
  },
};
export const UNIVERSE = 'identity-security-operations';

export const TRACKING_CONTEXT = {
  chapter1: UNIVERSE,
  chapter2: APP_NAME,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

export type TrackingTags =
  // resources
  | 'credential'
  | 'custom'
  | 'identity'
  | 'kmip-api-endoint-ca-rsa'
  | 'kmip-api-endoint-ca'
  | 'metadata'
  | 'okms'
  | 'ovh-generated'
  | 'rest-api-endoint-ca'
  | 'root-identity'
  | 'secret-config'
  | 'secret'
  | 'service-key'
  | 'swagger-ui'
  | 'region'
  | 'value'
  | 'version'
  | 'pem'
  | 'jwk'
  // guides
  | 'guide-kmip'
  | 'guide-quick-start'
  | 'guide-quick-usage'
  // actions
  | 'activate'
  | 'cancel'
  | 'confirm'
  | 'create'
  | 'deactivate'
  | 'delete'
  | 'download'
  | 'edit'
  | 'enable'
  | 'next'
  | 'order'
  | 'previous'
  | 'rename'
  | 'reveal'
  | 'select'
  | 'terminate'
  | 'toggle'
  //  pages
  | 'dashboard'
  | 'list'
  // others
  | 'general-informations'
  | 'logs'
  | 'off'
  | 'on'
  | 'type'
  | 'usage';
