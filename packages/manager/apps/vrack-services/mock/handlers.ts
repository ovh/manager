import { BrowserContext } from '@playwright/test';
import { toPlaywrightMockHandler } from '../../../../../playwright-helpers/mock';
import {
  toMswHandlers,
  Handler,
} from '../../../../super-components/_common/msw-helpers';
import { getVs, firstVs, secondVs } from './v2/get-vrackservices';
import vrackList from './v6/get-vrack.json';
import vrackDetails from './v6/get-vrack-details.json';
import { getZoneList } from './v2/get-zone-list';
import { getCart, getVrackItem, getVrackServicesItem } from './order/cart';
import {
  Task,
  OrderStatus,
  ResponseData,
  UpdateVrackServicesParams,
} from '../src/api';
import {
  emptyResponse,
  allVrackServicesResponse,
} from './v6/get-vrack-allowed-services';

export type ConfigParams = {
  nbVs?: number;
  nbZone?: number;
  noEligibleServices?: boolean;
  vrackOrderKo?: boolean;
  orderStatus?: OrderStatus;
  vrackServicesOrderKo?: boolean;
};

export const getConfig = ({
  nbVs,
  nbZone,
  noEligibleServices,
  orderStatus = 'delivering',
  vrackOrderKo,
  vrackServicesOrderKo,
}: ConfigParams): Handler[] => [
  {
    url: '/vrackServices/resource',
    response: getVs(nbVs),
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: ({ params }: { params: { id: string } }) =>
      params.id === firstVs.id ? firstVs : secondVs,
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: ({
      params,
      body,
    }: {
      params: { id: string };
      body: UpdateVrackServicesParams;
    }) => {
      const vs = firstVs.id === params.id ? firstVs : secondVs;
      vs.currentState.displayName = body.targetSpec.displayName;
      vs.currentState.subnets = body.targetSpec.subnets;
      return vs;
    },
    method: 'put',
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
  {
    url: '/order/cart',
    method: 'post',
    response: getCart,
    api: 'v6',
  },
  {
    url: '/order/cart/:id/assign',
    method: 'post',
    api: 'v6',
  },
  {
    url: '/order/cart/:id/vrack',
    method: 'post',
    response: getVrackItem,
    api: 'v6',
  },
  {
    url: '/order/cart/:id/vrackServices',
    method: 'post',
    response: getVrackServicesItem,
    api: 'v6',
  },
  {
    url: '/order/cart/:id/checkout',
    method: 'post',
    response: vrackServicesOrderKo
      ? ({
          status: 403,
          code: 'ERR_VRACK_SERVICES',
          data: null,
          response: {
            data: { message: 'Error Vrack Services' },
          },
        } as ResponseData<unknown>)
      : { orderId: orderStatus },
    status: vrackServicesOrderKo ? 403 : 200,
    api: 'v6',
    once: true,
  },
  {
    url: '/order/cart/:id/checkout',
    method: 'post',
    response: vrackOrderKo
      ? ({
          status: 403,
          code: 'ERR_MAX_VRACKS',
          data: null,
          response: {
            data: { message: 'You already own 60 vRacks, maximum is 60' },
          },
        } as ResponseData<unknown>)
      : { orderId: orderStatus },
    status: vrackOrderKo ? 403 : 200,
    api: 'v6',
    once: true,
  },
  {
    url: '/order/cart/:id/checkout',
    method: 'post',
    response: { orderId: 'delivering' },
    status: 200,
    api: 'v6',
  },
  {
    url: '/me/order/:id/status',
    response: orderStatus,
    api: 'v6',
    once: true,
  },
  {
    url: '/me/order/:id/status',
    response: orderStatus,
    api: 'v6',
    once: true,
  },
  {
    url: '/me/order/:id/status',
    response: 'delivered' as OrderStatus,
    api: 'v6',
  },
  {
    url: '/vrackServices/resource/:id/task',
    response: [{ id: '' }] as Task[],
    api: 'v6',
  },
  {
    url: '/vrack/:id/allowedServices',
    response: noEligibleServices ? emptyResponse : allVrackServicesResponse,
    api: 'v6',
  },
];

export const getHandlers = (params: ConfigParams = {}) =>
  toMswHandlers(getConfig(params));

export const setupPlaywrightHandlers = async (
  context: BrowserContext,
  params: ConfigParams = {},
) =>
  Promise.all(
    getConfig(params)
      .reverse()
      .map(toPlaywrightMockHandler(context)),
  );
