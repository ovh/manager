import { v2 } from '@ovh-ux/manager-core-api';

import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { mockVaultBucketAccess, mockVaults } from '@/mocks/vaults/vaults.mock';
import { VaultBucketAccess, VaultResource } from '@/types/Vault.type';
import { getVaultBucketCredentialsRoute, getVaultsRoute } from '@/utils/apiRoutes/apiRoutes';

export const getVaults = async (backupServicesId: string): Promise<VaultResource[]> => {
  if (USE_API_MOCKS) return mockVaults;

  const { data } = await v2.get<VaultResource[]>(getVaultsRoute(backupServicesId));
  return data;
};

/** Secrets : le contrat interdit de les journaliser ou de les cacher, d'où `Pragma: no-cache`. */
export const getVaultBucketAccess = async (
  backupServicesId: string,
  vaultId: string,
  bucketId: string,
): Promise<VaultBucketAccess> => {
  if (USE_API_MOCKS) return mockVaultBucketAccess;

  const { data } = await v2.get<VaultBucketAccess>(
    getVaultBucketCredentialsRoute(backupServicesId, vaultId, bucketId),
    { headers: { Pragma: 'no-cache' } },
  );
  return data;
};
