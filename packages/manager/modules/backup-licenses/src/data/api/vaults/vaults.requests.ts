import { v2 } from '@ovh-ux/manager-core-api';

import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { VaultResource } from '@/types/Vault.type';
import { getVaultsRoute } from '@/utils/apiRoutes/apiRoutes';

/**
 * Route empruntée à `@ovh-ux/backup-agent`, non vérifiée pour ce produit (cf. §14 de la
 * spec BKP-1225). `USE_API_MOCKS` permet de développer sans.
 */
export const getVaults = async (backupServicesId: string): Promise<VaultResource[]> => {
  if (USE_API_MOCKS) return mockVaults;

  const { data } = await v2.get<VaultResource[]>(getVaultsRoute(backupServicesId));
  return data;
};
