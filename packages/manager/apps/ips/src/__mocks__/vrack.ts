import { Handler } from '@ovh-ux/manager-core-test-utils';

import { availableService, expiredService } from './serviceInfo';

export const vrackMockList = [
  {
    name: 'pn-0000001',
    description: 'description of vrack 1',
    iam: {
      id: 'id1',
      urn: 'urn:v1:eu:resource:vrack:pn-0000001',
    },
  },
  {
    name: 'pn-0000002',
    description: '',
    iam: {
      id: 'id2',
      urn: 'urn:v1:eu:resource:vrack:pn-0000002',
    },
  },
];

export const publicRoutingRegionMocks = [
  {
    region: 'eu-west-par',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'eu-west-gra',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'eu-west-lim',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'eu-west-eri',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'eu-west-rbx',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'eu-west-sbg',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'eu-central-waw',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'ca-east-bhs',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'ca-east-tor',
    defaultBandwidthLimit: 5000,
    publicRoutingType: 'PUBLIC-ROUTING-3-AZ',
  },
  {
    region: 'ap-south-mum',
    defaultBandwidthLimit: 100,
    publicRoutingType: 'PUBLIC-ROUTING-1-AZ',
  },
  {
    region: 'ap-southeast-sgp',
    defaultBandwidthLimit: 100,
    publicRoutingType: 'PUBLIC-ROUTING-1-AZ',
  },
  {
    region: 'ap-southeast-syd',
    defaultBandwidthLimit: 100,
    publicRoutingType: 'PUBLIC-ROUTING-1-AZ',
  },
];

export const publicRoutingBandwidthLimitMocks = [
  {
    region: 'eu-west-par',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'eu-west-gra',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'eu-west-lim',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'eu-west-eri',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'eu-west-rbx',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'eu-west-sbg',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'eu-central-waw',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'ca-east-bhs',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'ca-east-tor',
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
  },
  {
    region: 'ap-south-mum',
    bandwidthLimit: 100,
    bandwidthLimitType: 'default',
  },
  {
    region: 'ap-southeast-sgp',
    bandwidthLimit: 100,
    bandwidthLimitType: 'default',
  },
  {
    region: 'ap-southeast-syd',
    bandwidthLimit: 100,
    bandwidthLimitType: 'default',
  },
];

export type GetVrackMocksParams = {
  nbVrack?: number;
  getVrackKo?: boolean;
  isVrackExpired?: boolean;
};

export const getVrackMocks = ({
  nbVrack = 2,
  getVrackKo,
  isVrackExpired,
}: GetVrackMocksParams): Handler[] => [
  {
    url: '/vrack/publicRoutingRegion',
    response: publicRoutingRegionMocks,
    api: 'v6',
  },
  {
    url: '/vrack/:serviceName/publicRoutingBandwidthLimit',
    response: publicRoutingBandwidthLimitMocks,
    api: 'v6',
  },
  {
    url: '/vrack/:serviceName/task/:taskId',
    response: {},
    api: 'v6',
    status: 404,
  },
  {
    url: '/vrack/:serviceName/task',
    response: [],
    api: 'v6',
  },
  {
    url: '/vrack/:serviceName/serviceInfos',
    response: isVrackExpired ? expiredService : availableService,
    api: 'v6',
  },
  {
    url: '/vrack',
    response: getVrackKo
      ? {
          message: 'Get vRack KO',
        }
      : vrackMockList.slice(0, nbVrack),
    api: 'v6',
    status: getVrackKo ? 400 : 200,
  },
  {
    url: '/order/cartServiceOption/vrack/:serviceName',
    response: [],
    api: 'v6',
  },
  {
    url: '/order/upgrade/bandwidthVrack',
    response: [],
    api: 'v6',
  },
];
