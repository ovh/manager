import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getLocations } from '@/data/api/locations/locations.requests';
import { VAULTS_TEST_IDS } from '@/pages/vaults/Vaults.page';
import { routeUrls } from '@/routes/routes.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';
import { MockParams } from '@/test-utils/setupMsw';
import { resetVaultPollingDeadlines } from '@/utils/vault/vaultPolling';

import { VAULT_ORDER_TEST_IDS } from './OrderVault.page';
import { LOCATIONS, clickSubmit, fillValidOrder, nameFieldError } from './_test/order.harness';

vi.mock('@/data/api/locations/locations.requests');

const order = labels.vaults.order;

const orderModalHeading = () => screen.queryByText(order.title);
const channelFailure = () => screen.queryByTestId(VAULT_ORDER_TEST_IDS.error);

const submitAnOrder = async (mockParams: MockParams = {}) => {
  await renderTest({ initialRoute: routeUrls.orderVault, ...mockParams });
  await fillValidOrder('vault-paygo-01');
  await clickSubmit();
};

/**
 * The submit path walked through the real request module: the outcome comes from the mocked ordering
 * channel (`vaultOrderOutcome`), not from a `vi.mock` of the module under test, so what these cover is
 * the wiring — the confirmation, the tab it lands on, and both error branches.
 */
describe('[INTEGRATION] Order-a-vault route', () => {
  beforeEach(() => {
    vi.mocked(getLocations).mockResolvedValue(LOCATIONS);
    resetVaultPollingDeadlines();
  });

  it('opens the modal at /vaults/order, so the tab CTA and a pasted URL both reach it', async () => {
    await renderTest({ initialRoute: routeUrls.orderVault });

    expect(
      await screen.findByText(order.field.name.label, undefined, { timeout: 20_000 }),
    ).toBeVisible();
    expect(orderModalHeading()).toBeVisible();
  });

  it('renders the vaults tab at /vaults, with no modal over it', async () => {
    await renderTest({ initialRoute: routeUrls.vaults });

    expect(await screen.findByTestId(VAULTS_TEST_IDS.page)).toBeVisible();
    await waitFor(() => expect(orderModalHeading()).not.toBeInTheDocument());
  });

  it('confirms an accepted order on the tab it returns to, and closes the modal', async () => {
    await submitAnOrder({ vaultOrderOutcome: 'accepted' });

    expect(await screen.findByText(order.success)).toBeVisible();
    expect(screen.getByTestId(VAULTS_TEST_IDS.page)).toBeVisible();
    await waitFor(() => expect(orderModalHeading()).not.toBeInTheDocument());
  });

  it('lands a name the backend refuses on the field, and keeps the modal open', async () => {
    await submitAnOrder({ vaultOrderOutcome: 'name-rejected' });

    await waitFor(() => expect(nameFieldError()).toBe('This vault name is already taken'));
    expect(orderModalHeading()).toBeVisible();
    expect(channelFailure()).not.toBeInTheDocument();
  });

  it('keeps a server-side refusal in the modal banner, and off every field', async () => {
    await submitAnOrder({ vaultOrderOutcome: 'error' });

    expect(await screen.findByTestId(VAULT_ORDER_TEST_IDS.error)).toHaveTextContent(
      'Internal server error',
    );
    expect(nameFieldError()).toBeNull();
  });

  it('renders its failure state while no ordering channel is published at all', async () => {
    await submitAnOrder();

    expect(await screen.findByTestId(VAULT_ORDER_TEST_IDS.error)).toHaveTextContent(
      order.error.submit_failed,
    );
    expect(orderModalHeading()).toBeVisible();
  });
});
