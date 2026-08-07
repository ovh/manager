import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  MOCK_CART_ID,
  PAYGO_VAULT_PLAN_CODE,
  mockVaultOfferInstallationPricing,
} from '@/mocks/order/order.mock';
import { VAULTS_TEST_IDS } from '@/pages/vaults/Vaults.page';
import { routeUrls } from '@/routes/routes.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';
import { MockParams } from '@/test-utils/setupMsw';
import {
  WatchedApiRequest,
  resolveApiRequests,
  stopWatchingApiCalls,
  watchApiRequests,
} from '@/test-utils/watchApiCalls';
import { resetVaultPollingDeadlines } from '@/utils/vault/vaultPolling';

import { VAULT_ORDER_TEST_IDS } from './OrderVault.page';
import { LOCATIONS, clickSubmit, fillValidOrder, nameFieldError } from './_test/order.harness';

const order = labels.vaults.order;

const orderModalHeading = () => screen.queryByText(order.title);
const channelFailure = () => screen.queryByTestId(VAULT_ORDER_TEST_IDS.error);

const submitAnOrder = async (mockParams: MockParams = {}) => {
  await renderTest({ initialRoute: routeUrls.orderVault, ...mockParams });
  await fillValidOrder('vault-paygo-01');
  await clickSubmit();
};

const writesOf = (requests: WatchedApiRequest[]) =>
  requests.filter(({ method }) => method === 'POST');

/**
 * The submit path walked through the real request module and the real Agora channel: the outcome comes
 * from the MSW handlers of the order routes, not from a `vi.mock` of the module under test, so what
 * these cover is the wiring — the sequence, the confirmation, the tab it lands on, and both error
 * branches.
 */
describe('[INTEGRATION] Order-a-vault route', () => {
  beforeEach(() => {
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
    await submitAnOrder();

    expect(await screen.findByText(order.success)).toBeVisible();
    expect(screen.getByTestId(VAULTS_TEST_IDS.page)).toBeVisible();
    await waitFor(() => expect(orderModalHeading()).not.toBeInTheDocument());
  });

  it('buys the vault as an option on the service, at the parameters the offer announced', async () => {
    await renderTest({ initialRoute: routeUrls.orderVault });
    const requests = watchApiRequests('/order/');
    await fillValidOrder('vault-paygo-01');
    await clickSubmit();
    await screen.findByText(order.success);
    const writes = writesOf(await resolveApiRequests(requests));
    stopWatchingApiCalls();

    const option = writes.find(({ url }) => url.includes('/cartServiceOption/'));
    expect(option?.body).toEqual({
      cartId: MOCK_CART_ID,
      planCode: PAYGO_VAULT_PLAN_CODE,
      // Read off the offer, never assumed — the fixture's installation pricing carries both.
      duration: mockVaultOfferInstallationPricing.duration,
      pricingMode: mockVaultOfferInstallationPricing.pricingMode,
      quantity: 1,
    });
    // The commitment is the POST on checkout; the GET before it only simulates.
    expect(writes.map(({ url }) => url).filter((url) => url.includes('/checkout'))).toHaveLength(1);
  });

  it('sends the name and the region as configurations of that item', async () => {
    await renderTest({ initialRoute: routeUrls.orderVault });
    const requests = watchApiRequests('/configuration');
    await fillValidOrder('vault-paygo-01');
    await clickSubmit();
    await screen.findByText(order.success);
    const configurations = writesOf(await resolveApiRequests(requests)).map(({ body }) => body);
    stopWatchingApiCalls();

    expect(configurations).toEqual(
      expect.arrayContaining([
        { label: 'vault_name', value: 'vault-paygo-01' },
        { label: 'vault_region', value: LOCATIONS[0]!.name },
      ]),
    );
    // Only the labels the cart claimed: the optional one it declared had no candidate value.
    expect(configurations).toHaveLength(2);
  });

  it('lands a name the backend refuses on the field, and keeps the modal open', async () => {
    await submitAnOrder({
      isOrderError: true,
      orderErrorStatus: 409,
      orderErrorMessage: 'This vault name is already taken',
    });

    await waitFor(() => expect(nameFieldError()).toBe('This vault name is already taken'));
    expect(orderModalHeading()).toBeVisible();
    expect(channelFailure()).not.toBeInTheDocument();
  });

  it('keeps a server-side refusal in the modal banner, and off every field', async () => {
    await submitAnOrder({ isOrderError: true });

    expect(await screen.findByTestId(VAULT_ORDER_TEST_IDS.error)).toHaveTextContent(
      'Internal server error',
    );
    expect(nameFieldError()).toBeNull();
  });

  it('refuses to order anything when the catalogue serves no pay-as-you-go vault offer', async () => {
    const requests = watchApiRequests('/order/cart');
    await submitAnOrder({ isServiceOfferMissing: true });

    expect(await screen.findByTestId(VAULT_ORDER_TEST_IDS.error)).toHaveTextContent(
      order.error.submit_failed,
    );
    expect(orderModalHeading()).toBeVisible();
    // No cart is opened on a guess: the offer is discovered before anything is bought.
    expect(writesOf(await resolveApiRequests(requests))).toHaveLength(0);
    stopWatchingApiCalls();
  });
});
