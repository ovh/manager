import { Handler } from '@playwright-helpers';

const regionList = [
  {
    description: 'France - Roubaix',
    code: 'RBX',
  },
  {
    description: 'Germany - Limburg',
    code: 'LIM',
  },
  {
    description: 'Canada - Beauharnois',
    code: 'BHS',
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
