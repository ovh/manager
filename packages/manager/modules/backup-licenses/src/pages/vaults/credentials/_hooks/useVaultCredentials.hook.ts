import { useQuery, useQueryClient } from '@tanstack/react-query';

import { vaultsQueries } from '@/data/queries/vaults.queries';
import {
  selectBackupLicensesVaults,
  selectVaultCredentialsBucket,
} from '@/data/selectors/vaults.selectors';

export const useVaultCredentials = (vaultId: string) => {
  const queryClient = useQueryClient();

  // Same projection as the tab's list, so a vault of another product line stays unreachable by URL.
  const {
    data: vaults,
    isPending: isVaultListPending,
    isSuccess: isVaultListResolved,
    isError: isVaultListError,
  } = useQuery({
    ...vaultsQueries.withClient(queryClient).list(),
    select: selectBackupLicensesVaults,
  });

  const vault = vaults?.find(({ id }) => id === vaultId);
  const bucket = vault && selectVaultCredentialsBucket(vault);

  const {
    data: credentials,
    isPending: isCredentialsPending,
    isError: isCredentialsError,
  } = useQuery(vaultsQueries.withClient(queryClient).bucketCredentials(vaultId, bucket?.id ?? ''));

  return {
    vault,
    bucket,
    credentials,
    isVaultListResolved,
    // A disabled query stays `pending` forever, so the keys only count once their bucket is known.
    isPending: isVaultListPending || (!!bucket && isCredentialsPending),
    isError: isVaultListError || isCredentialsError,
  };
};
