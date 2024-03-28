import { Handler } from '@playwright-helpers';
import {
  getOrderDetailsMocks,
  GetOrderDetailsMocksParams,
} from '../../../modules/order/mock';
import {
  getVrackServicesMocks,
  GetVrackServicesMocksParams,
} from './vrack-services/vrack-services';
import { getVracMocks, GetVrackMocksParams } from './vrack/vrack';
import { getRegionMocks, GetRegionMocksParams } from './vrack-services/region';
import {
  getAssociationMocks,
  GetAssociationMocksParams,
} from './vrack/association';
import { GetIamMocksParams, getIamMocks } from './iam/iam';
import { GetAuthenticationMocks, getAuthenticationMocks } from './auth/auth';

export type ConfigParams = GetVrackServicesMocksParams &
  GetAuthenticationMocks &
  GetOrderDetailsMocksParams &
  GetRegionMocksParams &
  GetVrackMocksParams &
  GetAssociationMocksParams &
  GetIamMocksParams;

export const getConfig = (params: ConfigParams): Handler[] =>
  [
    getAuthenticationMocks,
    getVrackServicesMocks,
    getRegionMocks,
    getVracMocks,
    getAssociationMocks,
    getOrderDetailsMocks,
    getIamMocks,
  ].flatMap((getMocks) => getMocks(params));
