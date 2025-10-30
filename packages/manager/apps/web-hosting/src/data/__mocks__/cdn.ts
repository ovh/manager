import { CdnOption, CdnOptionType } from '../types/product/cdn';

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
