import { useQuery, useQueryClient } from '@tanstack/react-query';

import { vaultsQueries } from '@/data/queries/vaults.queries';
import { selectBackupLicensesVaults } from '@/data/selectors/vaults.selectors';

export const useVaultsList = () => {
  const queryClient = useQueryClient();

  const { data, isPending, isError, refetch } = useQuery({
    ...vaultsQueries.withClient(queryClient).list(),
    select: selectBackupLicensesVaults,
  });

  return { vaults: data ?? [], isPending, isError, refetch };
};
