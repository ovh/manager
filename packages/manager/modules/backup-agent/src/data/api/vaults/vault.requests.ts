import { v2 } from '@ovh-ux/manager-core-api';

import { VaultResource } from '@/types/Vault.type';

const getVaultRoute = (locationName: string) => `/location/${locationName}`;

export const getVaultDetails = async (locationName: string) =>
  (await v2.get<VaultResource>(getVaultRoute(locationName))).data;

export const deleteVault = async (vaultId: string) =>
  v2.delete<string>(`/backup/tenant/vault/${vaultId}`);
