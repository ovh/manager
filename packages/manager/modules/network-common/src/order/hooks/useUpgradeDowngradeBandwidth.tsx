import { useContext } from 'react';

import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useDeleteService } from '../../services/hooks/useDeleteService';
import { Order } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { getUpgradedBandwidth } from '../api/get/upgradedBandwidth';
import {
  addVrackBandwidthToCart,
  assignCart,
  checkoutCart,
  createCart,
} from '../api/post/cart';
import {
  UpgradeBandwidthResponse,
  postUpgradeBandwidth,
} from '../api/post/upgradeBandwidth';
import { useVrackDefaultBandwidthCartOptions } from './useDefaultBandwidthOptions';
import { DEFAULT_BANDWIDTH_PLAN_CODE } from './useVrackBandwidthCartOptions';

export function useUpgradeDowngradeBandwidth({
  serviceName,
  currentBandwidthLimit,
  region,
  onSuccess,
  onError,
}: {
  serviceName: string;
  currentBandwidthLimit: number;
  region: string;
  onSuccess?: (
    response:
      | { order: Order }
      | { order: null; message: string }
      | UpgradeBandwidthResponse,
  ) => void;
  onError?: (error: ApiError | Error) => void;
}) {
  const { environment } = useContext(ShellContext);
  const { data, refetch } = useVrackDefaultBandwidthCartOptions();
  // TODO: Replace with updateService and change terminationPolicy to terminateServiceAtRenew when the API is fixed
  const { mutateAsync: deleteService } = useDeleteService({ force: true });

  return useMutation({
    mutationFn: async ({ planCode }: { planCode: string }) => {
      let isDefaultBandwidthOption = false;

      if (!data) {
        const result = await refetch({ throwOnError: true });
        isDefaultBandwidthOption =
          result.data?.isDefaultBandwidthOption({
            bandwidthLimit: currentBandwidthLimit,
            region,
          }) ?? false;
      } else {
        isDefaultBandwidthOption = data.isDefaultBandwidthOption({
          bandwidthLimit: currentBandwidthLimit,
          region,
        });
      }

      // Upgrade from default bandwidth option
      if (isDefaultBandwidthOption) {
        const cartResponse = await createCart(environment.user.ovhSubsidiary);
        await assignCart(cartResponse.data.cartId);
        await addVrackBandwidthToCart({
          cartId: cartResponse.data.cartId,
          serviceName,
          planCode,
        });
        const orderResponse = await checkoutCart(cartResponse.data.cartId);
        return { order: orderResponse.data };
      }

      const upgradedServiceList = await getUpgradedBandwidth();
      const upgradedService = upgradedServiceList.data.find(
        (option) => option.includes(serviceName) && option.includes(region),
      );

      if (!upgradedService) {
        throw new Error('No upgraded bandwidth option found for this service');
      }

      // Downgrade to default bandwidth option
      if (
        !isDefaultBandwidthOption &&
        planCode === DEFAULT_BANDWIDTH_PLAN_CODE
      ) {
        const result = await deleteService({ resourceName: upgradedService });
        return { order: null, message: result.data.message };
      }

      // Upgrade or downgrade from non-default bandwidth option
      const order = await postUpgradeBandwidth({
        serviceName: upgradedService,
        planCode,
      });
      return order.data;
    },
    onSuccess,
    onError,
  });
}
