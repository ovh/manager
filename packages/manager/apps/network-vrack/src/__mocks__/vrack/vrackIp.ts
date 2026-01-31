import { Handler } from '@ovh-ux/manager-core-test-utils';

const vrackIpV4Mocks = ['5.39.12.96/28', '5.135.62.80/28'];

const vrackIpV6Mocks = [
  '2001:41d0:f00:9c00::/56',
  '2001:41d0:a800:2700::/56',
  '2001:41d0:b00:1b00::/56',
  '2001:41d0:a900:1d00::/56',
];

const vrackIpv4DetailMocks = [
  {
    region: 'eu-west-rbx',
    gateway: '5.39.12.110/32',
    zone: 'rbx',
    ip: '5.39.12.96/28',
  },
  {
    region: 'eu-west-rbx',
    zone: 'rbx',
    gateway: '5.135.62.94/32',
    ip: '5.135.62.80/28',
  },
];

const vrackIpv6DetailMocks = [
  { ipv6: '2001:41d0:f00:9c00::/56', region: 'eu-west-lim' },
  { ipv6: '2001:41d0:a800:2700::/56', region: 'eu-central-waw' },
  { ipv6: '2001:41d0:b00:1b00::/56', region: 'eu-west-rbx' },
  { ipv6: '2001:41d0:a900:1d00::/56', region: 'eu-west-par' },
];

export const getVrackIpMocks = (): Handler[] => [
  {
    url: '/vrack/:id/ip',
    response: () => {
      return vrackIpV4Mocks;
    },
    status: 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/vrack/:id/ip/:idDetail',
    response: (_request: Request, params: { id: string; idDetail: string }) => {
      const idx = vrackIpV4Mocks.findIndex((ip) => ip === params.idDetail);
      return idx !== -1 ? vrackIpv4DetailMocks[idx] : undefined;
    },
    status: 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/vrack/:id/ipv6',
    response: () => {
      return vrackIpV6Mocks;
    },
    status: 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/vrack/:id/ipv6/:idDetail',
    response: (_request: Request, params: { id: string; idDetail: string }) => {
      const idx = vrackIpV6Mocks.findIndex((ip) => ip === params.idDetail);
      return idx !== -1 ? vrackIpv6DetailMocks[idx] : undefined;
    },
    status: 200,
    method: 'get',
    api: 'v6',
  },
];
