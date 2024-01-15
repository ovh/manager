import { toMswHandlers, Handler } from '../tests/utils/msw-helpers';
import { toPlaywrightMockHandler } from '../e2e/utils/playwright-helpers';
import { ICustomWorld } from '../../../../../playwright-helpers/custom-world';
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
import { GetAuthenticationMocks, getAuthenticationMocks } from './auth/auth';

export type ConfigParams = GetVrackServicesMocksParams &
  GetAuthenticationMocks &
  GetOrderDetailsMocksParams &
  GetCartMocksParams &
  GetZoneMocksParams &
  GetVrackMocksParams &
  GetAssociationMocksParams &
  GetIamMocksParams;

export const getConfig = (params: ConfigParams): Handler[] =>
  [
    getAuthenticationMocks,
    getVrackServicesMocks,
    getZoneMocks,
    getVracMocks,
    getAssociationMocks,
    getCartMocks,
    getOrderDetailsMocks,
    getIamMocks,
  ].flatMap((getMocks) => getMocks(params));

export const getMswHandlers = (
  params: ConfigParams = {},
  additionalConfigs?: Handler[],
) => toMswHandlers(getConfig(params).concat(additionalConfigs));

export const setupPlaywrightHandlers = async (world: ICustomWorld) =>
  Promise.all(
    getConfig({
      ...((world?.handlersConfig as ConfigParams) || ({} as ConfigParams)),
      isAuthMocked: true,
    })
      .reverse()
      .map(toPlaywrightMockHandler(world.context)),
  );
