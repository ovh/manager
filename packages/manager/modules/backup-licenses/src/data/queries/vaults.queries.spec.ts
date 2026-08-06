import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { mockEdgeCaseVaults, mockVaultBucketCredentials } from '@/mocks/vaults/vaults.mock';
import { setupMswMock } from '@/test-utils/setupMsw';
import { VaultResource } from '@/types/Vault.type';

import { vaultsQueries } from './vaults.queries';

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('vaultsQueries.list', () => {
  it('resolves the tenant, then lists its vaults', async () => {
    setupMswMock();
    const queryClient = createQueryClient();

    const vaults = await queryClient.fetchQuery(vaultsQueries.withClient(queryClient).list());

    expect(vaults[0]?.currentState.name).toBe('vault-veeam-multi-region');
  });

  it('rejects when the listing fails, so the error state can be rendered', async () => {
    setupMswMock({ isVaultListError: true });
    const queryClient = createQueryClient();

    await expect(
      queryClient.fetchQuery(vaultsQueries.withClient(queryClient).list()),
    ).rejects.toThrow();
  });

  const creatingVault = mockEdgeCaseVaults.filter(({ id }) => id === 'vault-status-creating');
  const statusOfCreating = (vaults: VaultResource[]) =>
    vaults.find(({ id }) => id === 'vault-status-creating')?.currentState.status;

  it('flips a creating vault to ready once polling has run, so polling can stop', async () => {
    setupMswMock({ vaults: creatingVault, vaultCreatingCallsBeforeReady: 1 });
    const queryClient = createQueryClient();
    const getVaults = () => queryClient.fetchQuery(vaultsQueries.withClient(queryClient).list());

    expect(statusOfCreating(await getVaults())).toBe('CREATING');
    expect(statusOfCreating(await getVaults())).toBe('READY');
  });

  it('keeps a stuck vault creating, so the timeout path can be exercised', async () => {
    setupMswMock({ vaults: creatingVault, vaultCreatingCallsBeforeReady: Infinity });
    const queryClient = createQueryClient();
    const list = vaultsQueries.withClient(queryClient).list();

    await queryClient.fetchQuery(list);

    expect(statusOfCreating(await queryClient.fetchQuery(list))).toBe('CREATING');
  });
});

describe('vaultsQueries.bucketCredentials', () => {
  it('returns the S3 keys of the requested bucket', async () => {
    setupMswMock();
    const queryClient = createQueryClient();

    const credentials = await queryClient.fetchQuery(
      vaultsQueries.withClient(queryClient).bucketCredentials('0001', '0001-b1'),
    );

    expect(credentials).toEqual(mockVaultBucketCredentials);
  });

  it('rejects when the credentials call fails', async () => {
    setupMswMock({ isVaultCredentialsError: true });
    const queryClient = createQueryClient();

    await expect(
      queryClient.fetchQuery(
        vaultsQueries.withClient(queryClient).bucketCredentials('0001', '0001-b1'),
      ),
    ).rejects.toThrow();
  });
});
