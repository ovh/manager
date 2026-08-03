import { screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mockVaultBucketAccess, mockVaultsFromDesign } from '@/mocks/vaults/vaults.mock';
import { getVaultCredentialsUrl, routeUrls } from '@/routes/routes.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { stopWatchingApiCalls, watchApiCalls } from '@/test-utils/watchApiCalls';
import { VaultResource } from '@/types/Vault.type';

const [, paygoVault] = mockVaultsFromDesign as [VaultResource, VaultResource];

let accessCalls: string[];

describe('[INTEGRATION] Vault credentials route', () => {
  beforeEach(() => {
    accessCalls = watchApiCalls('/access');
  });

  afterEach(() => {
    stopWatchingApiCalls();
  });

  it('asks for no credentials while only the list is displayed', async () => {
    await renderTest({ initialRoute: routeUrls.vaults, vaults: [paygoVault] });

    await waitFor(() => expect(screen.getByText(paygoVault.currentState.name)).toBeVisible(), {
      timeout: 20_000,
    });
    expect(accessCalls).toHaveLength(0);
  });

  it('is reachable at /vaults/:vaultId/credentials', async () => {
    await renderTest({
      initialRoute: getVaultCredentialsUrl(paygoVault.id),
      vaults: [paygoVault],
    });

    expect(
      await screen.findByText(mockVaultBucketAccess.accessKey, undefined, { timeout: 20_000 }),
    ).toBeVisible();
  });
});
