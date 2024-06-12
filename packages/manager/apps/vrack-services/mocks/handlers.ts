import { Handler } from '@playwright-helpers';
import {
  getOrderDetailsMocks,
  GetOrderDetailsMocksParams,
} from '@ovh-ux/manager-module-order/mock';
import {
  GetServicesMocksParams,
  getServicesMocks,
} from '@ovhcloud/manager-components/src/hooks/services/mocks/services.mock';
import {
  getVrackServicesMocks,
  GetVrackServicesMocksParams,
} from './vrack-services/vrack-services';
import { getVrackMocks, GetVrackMocksParams } from './vrack';
import { getRegionMocks, GetRegionMocksParams } from './vrack-services/region';
import { GetIamMocksParams, getIamMocks } from './iam/iam';
import {
  GetAuthenticationMocks,
  getAuthenticationMocks,
} from '../../../../../playwright-helpers/mocks/auth';

export type ConfigParams = GetVrackServicesMocksParams &
  GetAuthenticationMocks &
  GetOrderDetailsMocksParams &
  GetRegionMocksParams &
  GetVrackMocksParams &
  GetServicesMocksParams &
  GetIamMocksParams;

export const getConfig = (params: ConfigParams): Handler[] =>
  [
    getAuthenticationMocks,
    getVrackServicesMocks,
    getRegionMocks,
    getVrackMocks,
    getOrderDetailsMocks,
    getServicesMocks,
    getIamMocks,
  ].flatMap((getMocks) => getMocks(params));
