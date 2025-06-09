import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Order } from '@ovh-ux/manager-module-order';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  postUpgradeServiceOrder,
  UpgradeServiceOrderParamsType,
} from '@/data/api';

export const useUpgradeMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationOptions<Order, ApiError, UpgradeServiceOrderParamsType>) => {
  const { mutate: upgradeService, isPending: isSending } = useMutation({
    mutationFn: (params: UpgradeServiceOrderParamsType) => {
      return postUpgradeServiceOrder(params);
    },
    onSuccess,
    onError,
    onSettled,
  });

  return {
    upgradeService,
    isSending,
  };
};
