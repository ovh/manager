import { v2 } from '@ovh-ux/manager-core-api';

import { placeVaultOrder } from '@/data/api/order/vaultOrder';
import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { mockVaultBucketCredentials, mockVaults } from '@/mocks/vaults/vaults.mock';
import {
  VaultBucketCredentials,
  VaultOrder,
  VaultOrderContext,
  VaultResource,
} from '@/types/Vault.type';
import { getVaultBucketCredentialsRoute, getVaultsRoute } from '@/utils/apiRoutes/apiRoutes';

export const getVaults = async (backupServicesId: string): Promise<VaultResource[]> => {
  if (USE_API_MOCKS) return mockVaults;

  const { data } = await v2.get<VaultResource[]>(getVaultsRoute(backupServicesId));
  return data;
};

/** Secrets : le contrat interdit de les journaliser ou de les cacher, d'où `Pragma: no-cache`. */
export const getVaultBucketCredentials = async (
  backupServicesId: string,
  vaultId: string,
  bucketId: string,
): Promise<VaultBucketCredentials> => {
  if (USE_API_MOCKS) return mockVaultBucketCredentials;

  const { data } = await v2.get<VaultBucketCredentials>(
    getVaultBucketCredentialsRoute(backupServicesId, vaultId, bucketId),
    { headers: { Pragma: 'no-cache' } },
  );
  return data;
};

export type VaultOrderChannel = (order: VaultOrder, context: VaultOrderContext) => Promise<void>;

let vaultOrderChannel: VaultOrderChannel = placeVaultOrder;

/**
 * The single swap point of the slice, kept now that the real channel is installed: an order is an
 * Agora cart request, and nothing outside `placeVaultOrder` knows that. Tests that need an outcome
 * rather than a sequence replace it here; passing nothing restores the real one.
 */
export const setVaultOrderChannel = (channel?: VaultOrderChannel): void => {
  vaultOrderChannel = channel ?? placeVaultOrder;
};

export const orderVault = (order: VaultOrder, context: VaultOrderContext): Promise<void> =>
  vaultOrderChannel(order, context);
