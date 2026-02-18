import { CmsType } from './cms';

export type PostImportPayload = {
  targetSpec: {
    import: {
      adminLogin: string;
      adminPassword: string;
      adminURL?: string;
      cms: CmsType.WORDPRESS;
    };
  };
};
export type PostCreatePayload = {
  targetSpec: {
    creation: {
      adminLogin: string;
      adminPassword: string;
      adminURL?: string;
      cms: CmsType.WORDPRESS;
      cmsSpecific?: {
        wordpress?: {
          language?: string;
          url?: string;
        };
      };
      phpVersion?: string;
    };
  };
};
