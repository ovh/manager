import { CDN_TYPE, CDN_VERSION, CdnOption, CdnOptionType, CdnStatus } from '../types/product/cdn';

export const cdnPropertiesMock = {
  domain: 'abcdef.cluster030.hosting.ovh.net',
  free: false,
  status: CdnStatus.CREATED,
  taskId: '',
  type: CDN_TYPE.SECURITY,
  version: CDN_VERSION.CDN_HOSTING,
};

export const serviceNameCdnMock = {
  domain: 'qjfnqci.cluster100.hosting.ovh.net',
  free: true,
  status: 'created',
  taskId: 473761370,
  type: 'cdn-basic',
  version: 'cdn-hosting',
};

export const cdnOptionMock: CdnOption[] = [
  {
    name: 'devmode',
    type: CdnOptionType.DEVMODE,
    config: null,
    pattern: null,
    enabled: true,
    extra: null,
  },
  {
    name: 'brotli',
    type: CdnOptionType.BROTLI,
    config: null,
    pattern: null,
    enabled: true,
    extra: null,
  },
];
