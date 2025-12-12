import { v2 } from '@ovh-ux/manager-core-api';

import { VaultResource } from '@/types/Vault.type';

export const getVaultListRoute = (tenantId: string) => `/backupServices/tenant/${tenantId}/vault`;

const getVaultDetailsRoute = (tenantId: string, vaultId: string) => `${getVaultListRoute(tenantId)}/${vaultId}`;

export const getVaultDetails = async (tenantId: string, vaultId: string) =>
  (await v2.get<VaultResource>(getVaultDetailsRoute(tenantId, vaultId))).data;

export const deleteVault = async (tenantId: string, vaultId: string) =>
  v2.delete<string>(`/backupServices/tenant/${tenantId}/vault/${vaultId}`);
