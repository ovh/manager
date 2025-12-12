import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { getVaultDetails } from '@/data/api/vaults/vault.requests';
import { BACKUP_VAULTS_LIST_QUERY_KEY } from '@/data/hooks/vaults/getVault';
import { VaultResource } from '@/types/Vault.type';

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
} & Partial<Omit<DefinedInitialDataOptions<VaultResource>, 'queryKey' | 'queryFn'>>) =>
  useQuery({
    queryFn: () => getVaultDetails(vaultId),
    queryKey: BACKUP_VAULT_DETAILS_QUERY_KEY(vaultId),
    enabled: !!vaultId,
    ...options,
  });
