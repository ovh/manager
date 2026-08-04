import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockVaultBucketCredentials, mockVaultsFromDesign } from '@/mocks/vaults/vaults.mock';
import { VAULT_SECRET_MASK } from '@/module.constants';
import { labels } from '@/test-utils/i18ntest.utils';

import {
  LIVE_REGION_SELECTOR,
  VALUE_TEST_IDS,
  a11y,
  failingCredentialsParams,
  paygoVault,
  renderCredentials,
  revealSecret,
  secretField,
  statusRegion,
  waitForCredentials,
} from './_test/credentials.harness';

/**
 * `USE_API_MOCKS` renvoie les jeux de données sans passer par le réseau : ces tests exercent les
 * chemins d'erreur et de chargement, donc ils laissent la couche réseau s'exécuter, MSW répondant.
 */
vi.mock('@/mocks/mocks.config', () => ({ USE_API_MOCKS: false }));

describe('VaultCredentialsPage — what the modal says out loud', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('speaks the wait as text, from a region that outlives the answer it announces', async () => {
    // The answer is held back long enough for the wait to be observed after i18n has resolved.
    await renderCredentials(paygoVault.id, {
      vaults: mockVaultsFromDesign,
      vaultCredentialsDelay: 500,
    });

    const status = statusRegion();
    expect(status).toHaveAttribute('role', 'status');
    // A skeleton is an empty shadow root, and a live region announces text changes, not names: the
    // wording has to be a text node the region holds, not an `aria-label` on it.
    expect(await within(status).findByText(labels.vaults.credentials.loading)).toBeInTheDocument();
    expect(screen.queryByText(mockVaultBucketCredentials.accessKey)).not.toBeInTheDocument();

    await waitForCredentials();

    // The very same node before and after: a region created together with its content is never read.
    expect(statusRegion()).toBe(status);
    expect(status).toBeEmptyDOMElement();
  });

  it('announces the failure from that same region, without nesting a second one', async () => {
    await renderCredentials(paygoVault.id, failingCredentialsParams);

    const status = statusRegion();

    expect(await within(status).findByText(labels.vaults.credentials.error)).toBeVisible();
    expect(statusRegion()).toBe(status);
    // Two overlapping live regions queue the same change twice, in an order nothing defines.
    expect(status.querySelector(LIVE_REGION_SELECTOR)).toBeNull();
  });

  it('marks the mask as decoration and says instead that the value is withheld', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(within(secretField()).getByText(VAULT_SECRET_MASK)).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(secretField()).toHaveTextContent(a11y.value_hidden);

    await revealSecret();

    expect(secretField()).not.toHaveTextContent(a11y.value_hidden);
  });

  it('raises no violation while masked, revealed or in error, and never narrates a value', async () => {
    const { container, unmount } = await renderCredentials(paygoVault.id);

    await waitForCredentials();
    await expect(container).toBeAccessible();

    await revealSecret();
    await expect(container).toBeAccessible();
    // Values are read on demand: a region around them narrates every render, the reveal included.
    VALUE_TEST_IDS.forEach((testId) => {
      expect(screen.getByTestId(testId).closest(LIVE_REGION_SELECTOR)).toBeNull();
    });
    unmount();

    const { container: erroredContainer } = await renderCredentials(
      paygoVault.id,
      failingCredentialsParams,
    );

    await screen.findByText(labels.vaults.credentials.error);
    await expect(erroredContainer).toBeAccessible();
  });
});
