import {
  GetFeatureAvailabilityMocksParams,
  getFeatureAvailabilityMocks,
} from '@ovh-ux/manager-react-components';
import {
  GetServicesMocksParams,
  getServicesMocks,
} from '@ovh-ux/manager-module-common-api';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import {
  GetCartMocksParams,
  GetOrderDetailsMocksParams,
  getCartMocks,
  getOrderDetailsMocks,
} from '@ovh-ux/manager-module-order/__mocks__';
import { GetVrackMocksParams, getVrackMocks } from './vrack';
import {
  GetRegionMocksParams,
  GetVrackServicesMocksParams,
  getRegionMocks,
  getVrackServicesMocks,
} from './vrack-services';

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
