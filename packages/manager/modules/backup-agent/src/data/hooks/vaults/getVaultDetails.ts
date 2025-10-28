import { mockVaults } from '@/mocks/vaults/vaults';
import { useQuery, DefinedInitialDataOptions } from "@tanstack/react-query";
import {BACKUP_VAULTS_LIST_QUERY_KEY} from "@/data/hooks/vaults/getVault";
import { VaultResource } from "@/types/Vault.type";

export const BACKUP_VAULT_DETAILS_QUERY_KEY = (vaultId: string) => [...BACKUP_VAULTS_LIST_QUERY_KEY, 'details', vaultId];

export const useBackupVaultDetails = (
  {
    vaultId,
    ...options
  }: {
    vaultId: string;
  } & Partial<Omit<DefinedInitialDataOptions<VaultResource>, "queryKey" | "queryFn">>,
) => useQuery({
  queryFn: () => new Promise<VaultResource>((resolve, reject) => {
    const result = mockVaults.find(vault => vault.id === vaultId)
    result ? resolve(result) : reject(new Error('Vault not found'))
  }),
  queryKey: BACKUP_VAULT_DETAILS_QUERY_KEY(vaultId),
  ...options
})
