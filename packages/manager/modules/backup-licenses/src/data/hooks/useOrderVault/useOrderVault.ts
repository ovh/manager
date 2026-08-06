import { useContext } from 'react';

import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { orderVault } from '@/data/api/vaults/vaults.requests';
import { backupLicenseQueries } from '@/data/queries/backupLicense.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { VaultOrder } from '@/types/Vault.type';

export const useOrderVault = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: TApiCustomError) => void;
}): UseMutationResult<void, TApiCustomError, VaultOrder> => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const queryClient = useQueryClient();

  return useMutation({
    // `ensureQueryData` rather than a query mounted with the modal: the service name is only needed
    // to submit, and the id cascade is already cached by the time the service page has been walked.
    mutationFn: async (order: VaultOrder) => {
      const serviceName = await queryClient.ensureQueryData(
        backupLicenseQueries.withClient(queryClient).resourceName(),
      );

      return orderVault(order, { ovhSubsidiary, serviceName });
    },
    onError,
    onSuccess: async () => {
      // Awaited, so the confirmation the caller raises lands on a list that already holds the new
      // row in its "Creating" state rather than on the one the customer saw before ordering.
      await queryClient.invalidateQueries({ queryKey: queryKeys.vaults.all() });
      onSuccess();
    },
  });
};
