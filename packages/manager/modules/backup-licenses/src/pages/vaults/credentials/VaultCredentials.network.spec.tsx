import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { stopWatchingApiCalls, watchApiCalls } from '@/test-utils/watchApiCalls';

import {
  findMockVault,
  paygoVault,
  renderCredentials,
  waitForCredentials,
} from './_test/credentials.harness';

/**
 * Ces tests observent les requêtes réellement émises, donc ils désactivent l'interrupteur de mocks
 * du module — sinon les données arrivent sans passer par le réseau et il n'y a rien à observer.
 * Les autres tests de la modale s'en passent et restent dans `VaultCredentials.page.spec.tsx`.
 */
vi.mock('@/mocks/mocks.config', () => ({ USE_API_MOCKS: false }));

let accessCalls: string[];

describe('VaultCredentialsPage — requêtes émises', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    accessCalls = watchApiCalls('/access');
  });

  afterEach(() => {
    stopWatchingApiCalls();
  });

  it('issues exactly one credentials request when the modal opens', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(accessCalls).toHaveLength(1);
    expect(accessCalls[0]).toContain(`/vault/${paygoVault.id}/bucket/`);
  });

  it('reads the keys from the first PRIMARY bucket in READY status', async () => {
    const twoPrimariesVault = findMockVault('vault-two-primaries');

    await renderCredentials(twoPrimariesVault.id, { vaults: [twoPrimariesVault] });

    await waitForCredentials();
    expect(accessCalls[0]).toContain('/bucket/0109-b2/access');
  });

  it('describes that same bucket with the region and the endpoint it shows', async () => {
    const twoPrimariesVault = findMockVault('vault-two-primaries');

    await renderCredentials(twoPrimariesVault.id, { vaults: [twoPrimariesVault] });

    await waitForCredentials();
    // Un client S3 signe avec la région qu'on lui donne et refuse celle que l'endpoint contredit :
    // les deux champs décrivent donc le bucket éligible, ici dans une autre région que le vault.
    const region = screen.getByTestId('vault-credentials-region');
    expect(region).toHaveTextContent('eu-west-gra');
    expect(region).not.toHaveTextContent(twoPrimariesVault.currentState.region);
    expect(screen.getByTestId('vault-credentials-endpoint')).toHaveTextContent(
      's3.eu-west-gra.io.cloud.ovh.net',
    );
  });
});
