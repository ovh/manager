import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { getVaultDetails } from '@/data/api/vaults/vault.requests';
import { BACKUP_VAULTS_LIST_QUERY_KEY } from '@/data/hooks/vaults/getVault';
import { VaultResource } from '@/types/Vault.type';

import { useBackupServicesId } from '../backup/useBackupServicesId';

export const BACKUP_VAULT_DETAILS_QUERY_KEY = (vaultId: string) => [
  ...BACKUP_VAULTS_LIST_QUERY_KEY,
  'details',
  vaultId,
];

export const useBackupVaultDetails = ({
  vaultId,
  ...options
}: {
  vaultId: string;
} & Partial<Omit<DefinedInitialDataOptions<VaultResource>, 'queryKey' | 'queryFn'>>) => {
  const { backupServicesId, isPending } = useBackupServicesId();

  return {
    ...useQuery({
      queryFn: () => getVaultDetails(backupServicesId, vaultId),
      queryKey: BACKUP_VAULT_DETAILS_QUERY_KEY(vaultId),
      enabled: !!backupServicesId && !!vaultId,
      ...options,
    }),
    isLoadingBackupServicesId: isPending,
  };
};
