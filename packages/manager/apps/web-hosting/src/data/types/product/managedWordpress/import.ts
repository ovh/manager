import { ManagedWordpressCmsType } from './cms';

export type PostImportPayload = {
  adminLogin: string;
  adminPassword: string;
  adminURL?: string;
  cms: ManagedWordpressCmsType.WORDPRESS;
  cmsSpecific?: {
    wordPress?: {
      language?: string;
      url?: string;
    };
  };
};
