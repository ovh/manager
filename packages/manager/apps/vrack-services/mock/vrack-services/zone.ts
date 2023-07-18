import { Handler } from '@super-components/_common/msw-helpers';

const zoneList = [
  {
    description: 'France - Roubaix',
    name: 'RBX',
  },
  {
    description: 'Germany - Limburg',
    name: 'LIM',
  },
  {
    description: 'Canada - Beauharnois',
    name: 'BHS',
  },
];

export type GetZoneMocksParams = {
  nbZone?: number;
};

export const getZoneMocks = ({ nbZone = 3 }: GetZoneMocksParams): Handler[] => [
  {
    url: '/vrackServices/reference/zone',
    response: zoneList.slice(0, nbZone),
    api: 'v2',
  },
];
