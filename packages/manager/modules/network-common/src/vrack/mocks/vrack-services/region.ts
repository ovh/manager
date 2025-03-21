import { Handler } from '@ovh-ux/manager-core-test-utils';

const regionList = [
  {
    name: 'eu-west-rbx',
  },
  {
    name: 'eu-west-lim',
  },
  {
    name: 'eu-west-gra',
  },
];

export type GetRegionMocksParams = {
  nbRegion?: number;
};

export const getRegionMocks = ({
  nbRegion = 3,
}: GetRegionMocksParams): Handler[] => [
  {
    url: '/vrackServices/reference/region',
    response: regionList.slice(0, nbRegion),
    api: 'v2',
  },
];

export const getRegionFlagsMocks = (): Handler[] => [
  {
    url: '/flags/:country',
    response: '',
    baseUrl: '',
  },
];
