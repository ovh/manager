import { Handler } from '@ovh-ux/manager-core-test-utils';
import {
  getServicesMocks,
  GetServicesMocksParams,
} from '@ovh-ux/manager-module-common-api';
import {
  getCartMocks,
  GetCartMocksParams,
  getOrderDetailsMocks,
  GetOrderDetailsMocksParams,
} from '@ovh-ux/manager-module-order/__mocks__';
import {
  getFeatureAvailabilityMocks,
  GetFeatureAvailabilityMocksParams,
} from '@ovh-ux/manager-react-components';
import {
  getVrackServicesMocks,
  GetVrackServicesMocksParams,
} from './vrack-services/vrack-services';
import { getVrackMocks, GetVrackMocksParams } from './vrack';
import { getRegionMocks, GetRegionMocksParams } from './vrack-services/region';

export type NetworkConfigParams = GetVrackServicesMocksParams &
  GetOrderDetailsMocksParams &
  GetRegionMocksParams &
  GetVrackMocksParams &
  GetServicesMocksParams &
  GetCartMocksParams &
  Omit<GetFeatureAvailabilityMocksParams, 'featureAvailabilityResponse'> & {
    isVrackServicesFeatureUnavailable?: boolean;
    isVrackServicesOrderFeatureUnavailable?: boolean;
  };

export const getNetworkConfig = ({
  isFeatureAvailabilityServiceKo,
  isVrackServicesFeatureUnavailable,
  isVrackServicesOrderFeatureUnavailable,
  ...params
}: NetworkConfigParams): Handler[] =>
  [
    getVrackServicesMocks,
    getRegionMocks,
    getVrackMocks,
    getOrderDetailsMocks,
    getServicesMocks,
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

export * from './vrack-services';
export * from './vrack';
