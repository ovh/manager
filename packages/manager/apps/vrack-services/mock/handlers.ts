import { Handler } from '@playwright-helpers';
import {
  getCartMocks,
  GetCartMocksParams,
  getOrderDetailsMocks,
  GetOrderDetailsMocksParams,
} from '@ovh-ux/manager-module-order/mock';
import {
  getFeatureAvailabilityMocks,
  GetFeatureAvailabilityMocksParams,
} from '@ovhcloud/manager-components/src/hooks/feature-availability/mocks/feature-availability.mock';
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
  GetIamMocksParams &
  GetCartMocksParams &
  Omit<GetFeatureAvailabilityMocksParams, 'featureAvailabilityResponse'> & {
    isVrackServicesFeatureUnavailable?: boolean;
    isVrackServicesOrderFeatureUnavailable?: boolean;
  };

export const getConfig = ({
  isFeatureAvailabilityServiceKo,
  isVrackServicesFeatureUnavailable,
  isVrackServicesOrderFeatureUnavailable,
  ...params
}: ConfigParams): Handler[] =>
  [
    getAuthenticationMocks,
    getVrackServicesMocks,
    getRegionMocks,
    getVrackMocks,
    getOrderDetailsMocks,
    getIamMocks,
    getCartMocks,
  ]
    .flatMap((getMocks) => getMocks(params))
    .concat(
      getFeatureAvailabilityMocks({
        isFeatureAvailabilityServiceKo,
        featureAvailabilityResponse: {
          'vrack-services': !isVrackServicesFeatureUnavailable,
        },
      }),
    )
    .concat(
      getFeatureAvailabilityMocks({
        isFeatureAvailabilityServiceKo,
        featureAvailabilityResponse: {
          'vrack-services:order': !isVrackServicesOrderFeatureUnavailable,
        },
      }),
    );
