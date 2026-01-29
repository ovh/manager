import { Handler } from '@ovh-ux/manager-core-test-utils';

export const bandwidthLimitMocks = [
  {
    bandwidthLimit: 5000,
    region: 'eu-central-waw',
    bandwidthLimitType: 'default',
  },
  {
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
    region: 'eu-south-mil',
  },
  {
    bandwidthLimitType: 'default',
    region: 'eu-west-eri',
    bandwidthLimit: 5000,
  },
  {
    bandwidthLimit: 5000,
    region: 'eu-west-gra',
    bandwidthLimitType: 'default',
  },
  {
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
    region: 'eu-west-lim',
  },
  {
    bandwidthLimit: 5000,
    region: 'eu-west-par',
    bandwidthLimitType: 'default',
  },
  {
    bandwidthLimitType: 'default',
    region: 'eu-west-rbx',
    bandwidthLimit: 5000,
  },
  {
    bandwidthLimit: 5000,
    region: 'eu-west-sbg',
    bandwidthLimitType: 'default',
  },
  {
    bandwidthLimit: 100,
    region: 'ap-south-mum',
    bandwidthLimitType: 'default',
  },
  {
    bandwidthLimitType: 'default',
    region: 'ap-southeast-sgp',
    bandwidthLimit: 100,
  },
  {
    bandwidthLimitType: 'default',
    region: 'ap-southeast-syd',
    bandwidthLimit: 100,
  },
  {
    region: 'ca-east-bhs',
    bandwidthLimitType: 'default',
    bandwidthLimit: 5000,
  },
  {
    bandwidthLimit: 5000,
    bandwidthLimitType: 'default',
    region: 'ca-east-tor',
  },
];

export const getBandwidthLimitMocks = (): Handler[] => [
  {
    url: '/vrack/:serviceName/publicRoutingBandwidthLimit',
    response: () => {
      return bandwidthLimitMocks;
    },
    status: 200,
    method: 'get',
    api: 'v6',
  },
];
