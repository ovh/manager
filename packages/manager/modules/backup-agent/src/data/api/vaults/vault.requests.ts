import { v2 } from '@ovh-ux/manager-core-api';

import { VaultResource } from '@/types/Vault.type';

export const BACKUP_VAULTS_LIST_ROUTE = '/backup/tenant/vaults';

const getVaultDetailsRoute = (vaultId: string) => `${BACKUP_VAULTS_LIST_ROUTE}/${vaultId}`;

export const getVaultDetails = async (locationName: string) =>
  (await v2.get<VaultResource>(getVaultDetailsRoute(locationName))).data;

export const deleteVault = async (vaultId: string) =>
  v2.delete<string>(`/backup/tenant/vault/${vaultId}`);
