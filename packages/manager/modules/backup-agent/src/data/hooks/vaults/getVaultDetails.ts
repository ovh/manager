import { DefinedInitialDataOptions, QueryKey, queryOptions, useQuery } from '@tanstack/react-query';

import { getVaultDetails } from '@/data/api/vaults/vault.requests';
import { BACKUP_VAULTS_LIST_QUERY_KEY } from '@/data/hooks/vaults/getVault';
import { VaultResource } from '@/types/Vault.type';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';

export const BACKUP_VAULT_DETAILS_QUERY_KEY = (vaultId?: string | QueryKey) =>
  [...BACKUP_VAULTS_LIST_QUERY_KEY, 'details', vaultId] as QueryKey[];

export const useGetBackupVaultDetailsOptions = () => {
  const getBackupServiceId = useGetBackupServicesId();

  return ({ vaultId }: { vaultId?: string }) =>
    queryOptions({
      queryFn: async () => {
        const backupServicesId = await getBackupServiceId();
        return getVaultDetails(backupServicesId!, vaultId!);
      },
      queryKey: BACKUP_VAULT_DETAILS_QUERY_KEY(vaultId),
      enabled: !!vaultId,
    });
};

export const useBackupVaultDetails = ({
  vaultId,
}: {
  vaultId?: string;
} & Partial<
  Omit<
    DefinedInitialDataOptions<VaultResource, Error, VaultResource, QueryKey>,
    'queryKey' | 'queryFn'
  >
>) => {
  const getBackupVaultDetailsOptions = useGetBackupVaultDetailsOptions();

  return useQuery(getBackupVaultDetailsOptions({ vaultId }));
};
