import { BrowserContext } from '@playwright/test';
import { toPlaywrightMockHandler } from '../../../../../playwright-helpers/mock';
import {
  toMswHandlers,
  Handler,
} from '../../../../super-components/_common/msw-helpers';
import {
  getVrackServicesMocks,
  GetVrackServicesMocksParams,
} from './vrack-services/vrack-services';
import { getVracMocks, GetVrackMocksParams } from './vrack/vrack';
import { getZoneMocks, GetZoneMocksParams } from './vrack-services/zone';
import { getTaskMocks, GetTaskMocksParams } from './vrack-services/task';
import { getCartMocks, GetCartMocksParams } from './order/cart';
import {
  getAssociationMocks,
  GetAssociationMocksParams,
} from './vrack/association';
import {
  GetOrderDetailsMocksParams,
  getOrderDetailsMocks,
} from './order/order-details';

export type ConfigParams = GetVrackServicesMocksParams &
  GetOrderDetailsMocksParams &
  GetCartMocksParams &
  GetZoneMocksParams &
  GetTaskMocksParams &
  GetVrackMocksParams &
  GetAssociationMocksParams;

export const getConfig = (params: ConfigParams): Handler[] =>
  [
    getVrackServicesMocks,
    getZoneMocks,
    getTaskMocks,
    getVracMocks,
    getAssociationMocks,
    getCartMocks,
    getOrderDetailsMocks,
  ].flatMap((getMocks) => getMocks(params));

export const getMswHandlers = (params: ConfigParams = {}) =>
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
