import { Handler } from '@ovh-ux/manager-core-test-utils';
import {
  getCartMocks,
  GetCartMocksParams,
  getOrderDetailsMocks,
  GetOrderDetailsMocksParams,
} from '@ovh-ux/manager-module-order/mock';
import {
  GetServicesMocksParams,
  getServicesMocks,
  getFeatureAvailabilityMocks,
  GetFeatureAvailabilityMocksParams,
} from '@ovh-ux/manager-react-components';
import { getIpsMocks, GetIpsMocksParams } from './ip/ip';
import {
  getDedicatedMocks,
  GetDedicatedMocksParams,
} from './dedicated/get-dedicated-virtualmac';

export type ConfigParams = GetIpsMocksParams &
  GetDedicatedMocksParams &
  GetOrderDetailsMocksParams &
  GetServicesMocksParams &
  GetCartMocksParams &
  Omit<GetFeatureAvailabilityMocksParams, 'featureAvailabilityResponse'> & {
    isIpsFeatureUnavailable?: boolean;
  };

export const getConfig = ({
  isFeatureAvailabilityServiceKo,
  isIpsFeatureUnavailable,
  ...params
}: ConfigParams): Handler[] =>
  [
    getOrderDetailsMocks,
    getServicesMocks,
    getCartMocks,
    getIpsMocks,
    getDedicatedMocks,
  ]
    .flatMap((getMocks) => getMocks(params))
    .concat(
      getFeatureAvailabilityMocks({
        isFeatureAvailabilityServiceKo,
        featureAvailabilityResponse: {
          ips: !isIpsFeatureUnavailable,
        },
      }),
    );
