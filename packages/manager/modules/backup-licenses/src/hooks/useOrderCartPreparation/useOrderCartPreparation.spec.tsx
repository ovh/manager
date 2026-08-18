import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MOCK_CART_ID, mockOrderFunnelRequiredConfiguration } from '@/mocks/order/order.mock';
import { MockParams, setupMswMock } from '@/test-utils/setupMsw';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import {
  WatchedApiRequest,
  resolveApiRequests,
  stopWatchingApiCalls,
  watchApiRequests,
} from '@/test-utils/watchApiCalls';
import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';

import { useOrderCartPreparation } from './useOrderCartPreparation';

const form: ServerVaultFormState = {
  displayName: 'backup-prod-paris',
  backupServerExternalIp: '203.0.113.10',
  veeamClientIp: '',
  isBehindNat: false,
  backupServerPrivateIp: '',
  vaultDisplayName: 'vault-prod-paris',
  regionApiValue: 'eu-west-par',
};

const formWithoutRegion: ServerVaultFormState = { ...form, regionApiValue: null };

const renderPreparation = async (
  initialForm: ServerVaultFormState,
  mockParams: MockParams = {},
) => {
  setupMswMock({
    cartRequiredConfiguration: mockOrderFunnelRequiredConfiguration,
    ...mockParams,
  });
  const wrapper = await testWrapperBuilder().withQueryClient().withShellContext().build();

  return renderHook(
    ({ currentForm }: { currentForm: ServerVaultFormState }) =>
      useOrderCartPreparation({ form: currentForm, licenseType: LicenseApiValue.VDP_PREMIUM }),
    { wrapper, initialProps: { currentForm: initialForm } },
  );
};

const createdCarts = (requests: WatchedApiRequest[]) =>
  requests.filter(({ method, url }) => method === 'POST' && url.endsWith('/order/cart'));

describe('useOrderCartPreparation', () => {
  let requests: Promise<WatchedApiRequest>[];

  beforeEach(() => {
    vi.clearAllMocks();
    requests = watchApiRequests('/order/cart');
  });

  afterEach(() => {
    stopWatchingApiCalls();
  });

  it("ne touche à rien tant que la région n'est pas choisie", async () => {
    const { result } = await renderPreparation(formWithoutRegion);

    expect(result.current.isPreparing).toBe(false);
    expect(result.current.cartId).toBeNull();
    expect(await resolveApiRequests(requests)).toHaveLength(0);
  });

  it('monte le panier dès que la région est choisie et remonte ses contrats', async () => {
    const { result } = await renderPreparation(form);

    await waitFor(() => expect(result.current.cartId).toBe(MOCK_CART_ID));
    expect(result.current.contractList).toEqual([
      expect.objectContaining({ name: 'Test contract' }),
    ]);
    expect(result.current.isPreparing).toBe(false);
    expect(createdCarts(await resolveApiRequests(requests))).toHaveLength(1);
  });

  it("n'autorise le checkout qu'une fois les contrats acceptés", async () => {
    const { result } = await renderPreparation(form);

    await waitFor(() => expect(result.current.cartId).toBe(MOCK_CART_ID));
    expect(result.current.isReadyToCheckout).toBe(false);

    act(() => result.current.acceptTerms(true));

    expect(result.current.areTermsAccepted).toBe(true);
    expect(result.current.isReadyToCheckout).toBe(true);
  });

  it('refait le panier et redemande une acceptation quand la région change', async () => {
    const { result, rerender } = await renderPreparation(form);

    await waitFor(() => expect(result.current.cartId).toBe(MOCK_CART_ID));
    act(() => result.current.acceptTerms(true));

    rerender({ currentForm: { ...form, regionApiValue: 'eu-west-lim' } });

    expect(result.current.areTermsAccepted).toBe(false);
    expect(result.current.isReadyToCheckout).toBe(false);
    await waitFor(() => expect(result.current.cartId).toBe(MOCK_CART_ID));
    expect(createdCarts(await resolveApiRequests(requests))).toHaveLength(2);
  });

  it('jette le panier quand le client revient sur une étape précédente', async () => {
    const { result, rerender } = await renderPreparation(form);

    await waitFor(() => expect(result.current.cartId).toBe(MOCK_CART_ID));
    act(() => result.current.acceptTerms(true));

    rerender({ currentForm: formWithoutRegion });

    expect(result.current.cartId).toBeNull();
    expect(result.current.contractList).toHaveLength(0);
    expect(result.current.areTermsAccepted).toBe(false);
  });

  it("signale un panier qui n'a pas pu être préparé, et le remonte au réessai", async () => {
    const { result } = await renderPreparation(form, { isOrderError: true });

    await waitFor(() => expect(result.current.hasPreparationFailed).toBe(true));
    expect(result.current.cartId).toBeNull();
    expect(result.current.isPreparing).toBe(false);

    act(() => result.current.retryPreparation());

    await waitFor(async () =>
      expect(createdCarts(await resolveApiRequests(requests))).toHaveLength(2),
    );
  });
});
