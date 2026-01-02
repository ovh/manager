import { v2 } from '@ovh-ux/manager-core-api';

import { VaultResource } from '@/types/Vault.type';
import { getVaultDetailsRoute } from '@/utils/apiRoutes';

export const getVaultDetails = async (backupServicesId: string, vaultId: string) => {
  const { data } = await v2.get<VaultResource>(getVaultDetailsRoute(backupServicesId, vaultId));
  return data;
};

export const deleteVault = async (backupServicesId: string, vaultId: string) => {
  const { data } = await v2.delete<string>(getVaultDetailsRoute(backupServicesId, vaultId));
  return data;
};
