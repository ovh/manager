import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { VCDOrganization ,
  checkoutVcdaOrder,
  getVcdaDatacenterZone,
  PreparedVcdaOrder,
  prepareVcdaOrder,
} from '@ovh-ux/manager-module-vcd-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getVcdaMigrationQueryKey } from '@/data/hooks/vcda/vcdaQueryKey';
import { getVcdaStatusQueryKey } from '@/data/hooks/vcda/useVcdaStatus.hook';

export type UsePrepareVcdaOrderParams = {
  orgId: string;
  organization?: VCDOrganization;
};

export type OrderVcdaVariables = {
  initialWhitelistCidr: string;
};

export const usePrepareVcdaOrder = ({
  orgId,
  organization,
}: UsePrepareVcdaOrderParams) => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();

  const mutation = useMutation<PreparedVcdaOrder, ApiError, OrderVcdaVariables>(
    {
      mutationFn: ({ initialWhitelistCidr }) =>
        prepareVcdaOrder({
          ovhSubsidiary,
          config: {
            orgId,
            externalIp: initialWhitelistCidr,
            datacenterZone: getVcdaDatacenterZone(organization),
          },
        }),
    },
  );

  return {
    prepareVcda: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export type UseCheckoutVcdaOrderParams = {
  orgId: string;
  onSuccess?: () => void;
};

/**
 * The tile/tab (useVcdaStatus) and the migration page (useVcdaMigration) read two
 * distinct caches — both are invalidated on success.
 */
export const useCheckoutVcdaOrder = ({
  orgId,
  onSuccess,
}: UseCheckoutVcdaOrderParams) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, ApiError, string>({
    mutationFn: (cartId) => checkoutVcdaOrder(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVcdaStatusQueryKey(orgId),
      });
      queryClient.invalidateQueries({
        queryKey: getVcdaMigrationQueryKey(orgId),
      });
      onSuccess?.();
    },
  });

  return {
    checkoutVcda: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};
