import { Handler } from '@ovh-ux/manager-core-test-utils';

const vrackIpV6BridgedSubrangeMocks = ['2001:41d0:f00:9c00::/64'];
const vrackIpV6RoutedSubrangeMocks = ['2001:41d0:f00:9d00::/60'];

const vrackIpv6BridgedSubrangeDetailMocks = [
  {
    bridgedSubrange: '2001:41d0:f00:9c00::/64',
    gateway: '2001:41d0:0f00:9c00:0000:0000:0000:0001',
    slaac: 'enabled',
  },
];

const vrackIpv6RoutedSubrangeDetailMocks = [
  {
    nexthop: '2001:41d0:f00:9c00::2',
    routedSubrange: '2001:41d0:f00:9d00::/60',
  },
];

export const getVrackIpSubrangeMocks = (): Handler[] => [
  {
    url: '/vrack/:id/ipv6/:ip/bridgedSubrange',
    response: (_request: Request, params: { id: string; ip: string }) =>
      params.ip === '2001:41d0:f00:9c00::/56' ? vrackIpV6BridgedSubrangeMocks : [],
    status: 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/vrack/:id/ipv6/:ip/bridgedSubrange/:subrange',
    response: (_request: Request, params: { id: string; ip: string; subrange: string }) =>
      params.subrange === vrackIpV6BridgedSubrangeMocks[0]
        ? vrackIpv6BridgedSubrangeDetailMocks[0]
        : undefined,
    status: 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/vrack/:id/ipv6/:ip/routedSubrange',
    response: (_request: Request, params: { id: string; ip: string }) =>
      params.ip === '2001:41d0:f00:9c00::/56' ? vrackIpV6RoutedSubrangeMocks : [],
    status: 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/vrack/:id/ipv6/:ip/routedSubrange/:subrange',
    response: (_request: Request, params: { id: string; ip: string; subrange: string }) =>
      params.subrange === vrackIpV6RoutedSubrangeMocks[0]
        ? vrackIpv6RoutedSubrangeDetailMocks[0]
        : undefined,
    status: 200,
    method: 'get',
    api: 'v6',
  },
];
