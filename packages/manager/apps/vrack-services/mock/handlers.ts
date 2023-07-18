import {
  toMswHandlers,
  Handler,
} from '../../../../super-components/_common/msw-helpers';
import { getVs, firstVs, secondVs } from './v2/get-vrackservices';
import vrackList from './v6/get-vrack.json';
import vrackDetails from './v6/get-vrack-details.json';
import { getZoneList } from './v2/get-zone-list';

type ConfigParams = {
  nbVs?: number;
  nbZone?: number;
};

export const getConfig = ({ nbVs, nbZone }: ConfigParams): Handler[] => [
  {
    url: '/vrackServices/resource',
    response: getVs(nbVs),
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: (id: string) => (firstVs.id === id ? firstVs : secondVs),
    api: 'v2',
  },
  {
    url: '/vrackServices/reference/zone',
    response: getZoneList(nbZone),
    api: 'v2',
  },
  {
    url: '/vrack',
    response: vrackList,
    api: 'v6',
  },
  {
    url: '/vrack/:id',
    response: vrackDetails,
    api: 'v6',
  },
];

export const getHandlers = (params: ConfigParams = {}) =>
  toMswHandlers(getConfig(params));
