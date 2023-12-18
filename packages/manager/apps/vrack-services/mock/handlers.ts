import { ICustomWorld } from '@playwright-helpers/custom-world';
import {
  toMswHandlers,
  Handler,
} from '../../../../super-components/_common/msw-helpers';
import { toPlaywrightMockHandler } from '../../../../../playwright-helpers/mock';
import {
  getVrackServicesMocks,
  GetVrackServicesMocksParams,
} from './vrack-services/vrack-services';
import { getVracMocks, GetVrackMocksParams } from './vrack/vrack';
import { getZoneMocks, GetZoneMocksParams } from './vrack-services/zone';
import { getCartMocks, GetCartMocksParams } from './order/cart';
import {
  getAssociationMocks,
  GetAssociationMocksParams,
} from './vrack/association';
import {
  GetOrderDetailsMocksParams,
  getOrderDetailsMocks,
} from './order/order-details';
import { GetIamMocksParams, getIamMocks } from './iam/iam';

export type ConfigParams = GetVrackServicesMocksParams &
  GetOrderDetailsMocksParams &
  GetCartMocksParams &
  GetZoneMocksParams &
  GetVrackMocksParams &
  GetAssociationMocksParams &
  GetIamMocksParams;

export const getConfig = (params: ConfigParams): Handler[] =>
  [
    getVrackServicesMocks,
    getZoneMocks,
    getVracMocks,
    getAssociationMocks,
    getCartMocks,
    getOrderDetailsMocks,
    getIamMocks,
  ].flatMap((getMocks) => getMocks(params));

export const getMswHandlers = (params: ConfigParams = {}) =>
  toMswHandlers(getConfig(params));

export const setupPlaywrightHandlers = async (world: ICustomWorld) =>
  Promise.all(
    getConfig(world.handlersConfig)
      .reverse()
      .map(toPlaywrightMockHandler(world.context)),
  );
