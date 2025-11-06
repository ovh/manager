import { CDN_TYPE, CDN_VERSION, CdnStatus } from '../types/product/cdn';

export const cdnPropertiesMock = {
  domain: 'abcdef.cluster030.hosting.ovh.net',
  free: false,
  status: CdnStatus.CREATED,
  taskId: '',
  type: CDN_TYPE.SECURITY,
  version: CDN_VERSION.CDN_HOSTING,
};
