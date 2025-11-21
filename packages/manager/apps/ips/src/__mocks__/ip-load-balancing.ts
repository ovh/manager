import { Handler } from '@ovh-ux/manager-core-test-utils';

export type GetIpLoadBalancingMocksParams = { isIpLoadBalancingKo?: boolean };

export const getIpLoadBalancingMocks = ({
  isIpLoadBalancingKo,
}: GetIpLoadBalancingMocksParams): Handler[] => [
  {
    url: '/ipLoadbalancing',
    response: isIpLoadBalancingKo ? { message: 'ipLoadbalancing error' } : [],
    api: 'v6',
    status: isIpLoadBalancingKo ? 500 : 200,
  },
];
