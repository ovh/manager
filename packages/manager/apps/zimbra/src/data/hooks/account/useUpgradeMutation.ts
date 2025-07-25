import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  postUpgradeServiceOrder,
  UpgradeServiceOrderParamsType,
  UpgradeServiceOrderResponse,
} from '@/data/api';

export const useUpgradeMutation = ({
  onSuccess,
  onError,
  onSettled,
}: UseMutationOptions<
  UpgradeServiceOrderResponse,
  ApiError,
  UpgradeServiceOrderParamsType
>) => {
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
