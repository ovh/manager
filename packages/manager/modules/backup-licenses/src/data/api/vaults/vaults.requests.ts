import { v2 } from '@ovh-ux/manager-core-api';

import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { mockVaultBucketAccess, mockVaults } from '@/mocks/vaults/vaults.mock';
import { VaultBucketAccess, VaultOrder, VaultResource } from '@/types/Vault.type';
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
): Promise<VaultBucketAccess> => {
  if (USE_API_MOCKS) return mockVaultBucketAccess;

  const { data } = await v2.get<VaultBucketAccess>(
    getVaultBucketCredentialsRoute(backupServicesId, vaultId, bucketId),
    { headers: { Pragma: 'no-cache' } },
  );
  return data;
};

export const VAULT_ORDER_CHANNEL_UNAVAILABLE = 'vault ordering channel is not delivered';

export type VaultOrderChannel = (order: VaultOrder) => Promise<void>;

/**
 * How an order is placed, and today the answer is "it cannot be". Three published facts, not an
 * omission: `.../vault` exposes GET only, the `POST /publicCloud/.../storage/object/bucket` BKP-1223
 * names is absent from the v2 schema (that section is Rancher-only), and the express order link its
 * 2026-07-10 comment replaced the route with was never documented. Sending anything would mean
 * inventing a route, so this rejects and the modal shows its failure state.
 */
const undeliveredChannel: VaultOrderChannel = () =>
  Promise.reject(new Error(VAULT_ORDER_CHANNEL_UNAVAILABLE));

let vaultOrderChannel: VaultOrderChannel = undeliveredChannel;

/**
 * The single swap point of the slice: when the channel lands — the express link, or the Agora cart
 * slice 0.2 already uses through `createCart` — it is installed here and nothing else changes.
 *
 * It is also what makes the submit path walkable while the channel is missing: no route means no MSW
 * handler, so `src/mocks/vaults/vaults.orderChannel.ts` installs the outcome instead of serving it,
 * off the same `setupMswMock` params as the list fixtures. Passing nothing restores the stub.
 */
export const setVaultOrderChannel = (channel?: VaultOrderChannel): void => {
  vaultOrderChannel = channel ?? undeliveredChannel;
};

export const orderVault = (order: VaultOrder): Promise<void> => vaultOrderChannel(order);
