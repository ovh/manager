import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UNKNOWN_CART_CONFIGURATION } from '@/data/api/order/order.requests';
import {
  MOCK_CART_ID,
  MOCK_CART_ITEM_ID,
  mockCartRequiredConfiguration,
  mockOrderFunnelRequiredConfiguration,
} from '@/mocks/order/order.mock';
import { MockParams, setupMswMock } from '@/test-utils/setupMsw';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import {
  WatchedApiRequest,
  resolveApiRequests,
  stopWatchingApiCalls,
  watchApiRequests,
} from '@/test-utils/watchApiCalls';
import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';
import { BACKUP_LICENSES_ORDER_PLAN_CODES } from '@/utils/orderComposition/orderComposition';

import { useOrderBackupLicenses } from './useOrderBackupLicenses';

const form: ServerVaultFormState = {
  displayName: 'backup-prod-paris',
  backupServerExternalIp: '203.0.113.10',
  isBehindNat: false,
  backupServerPrivateIp: '',
  vaultDisplayName: 'vault-prod-paris',
  regionApiValue: 'eu-west-par',
};

const renderOrderHook = async (mockParams: MockParams = {}) => {
  setupMswMock({
    cartRequiredConfiguration: mockOrderFunnelRequiredConfiguration,
    ...mockParams,
  });
  const wrapper = await testWrapperBuilder().withQueryClient().withShellContext().build();
  const onSuccess = vi.fn();
  const { result } = renderHook(() => useOrderBackupLicenses({ onSuccess }), { wrapper });

  return { result, onSuccess };
};

const posted = (requests: WatchedApiRequest[], fragment: string) =>
  requests.filter(({ method, url }) => method === 'POST' && url.includes(fragment));

const configurations = (requests: WatchedApiRequest[]) =>
  posted(requests, '/configuration').map(({ body }) => body);

describe('useOrderBackupLicenses', () => {
  let requests: Promise<WatchedApiRequest>[];

  beforeEach(() => {
    vi.clearAllMocks();
    requests = watchApiRequests('/order/cart');
  });

  afterEach(() => {
    stopWatchingApiCalls();
  });

  it('walks the cart in order: item, addons, assign, then the checkout that engages', async () => {
    const { result, onSuccess } = await renderOrderHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const emitted = await resolveApiRequests(requests);
    const sequence = emitted
      .filter(({ method }) => method === 'POST')
      .map(({ url }) => url.replace(/^.*\/order\/cart/, '/order/cart'))
      .filter((url) => !url.includes('/configuration'));

    expect(sequence).toEqual([
      '/order/cart',
      `/order/cart/${MOCK_CART_ID}/backupServices`,
      `/order/cart/${MOCK_CART_ID}/backupServices/options`,
      `/order/cart/${MOCK_CART_ID}/backupServices/options`,
      `/order/cart/${MOCK_CART_ID}/backupServices/options`,
      `/order/cart/${MOCK_CART_ID}/assign`,
      `/order/cart/${MOCK_CART_ID}/checkout`,
    ]);
  });

  it('composes the tenant and its three addons of R2, monthly and by the unit', async () => {
    const { result, onSuccess } = await renderOrderHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const emitted = await resolveApiRequests(requests);

    const mainItem = emitted.find(
      ({ method, url }) => method === 'POST' && url.endsWith('/backupServices'),
    );
    expect(mainItem?.body).toEqual({
      planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.tenant,
      duration: 'P1M',
      pricingMode: 'default',
      quantity: 1,
    });
    expect(posted(emitted, '/backupServices/options').map(({ body }) => body)).toEqual(
      [
        BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenant,
        BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenantLicenses,
        BACKUP_LICENSES_ORDER_PLAN_CODES.bundledVault,
      ].map((planCode) => ({
        planCode,
        duration: 'P1M',
        pricingMode: 'default',
        quantity: 1,
        // L'id de l'item principal, pas le sien : les addons s'y rattachent.
        itemId: MOCK_CART_ITEM_ID,
      })),
    );
  });

  it('answers each label the cart asks for, on every item that asks for it', async () => {
    const { result, onSuccess } = await renderOrderHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const emitted = await resolveApiRequests(requests);
    const answered = configurations(emitted);

    // 4 items (le tenant et ses 3 addons) × les 5 labels réclamés auxquels une valeur répond.
    expect(answered).toHaveLength(20);
    expect(answered).toEqual(
      expect.arrayContaining([
        { label: 'displayName', value: 'backup-prod-paris' },
        { label: 'backupServerExternalIp', value: '203.0.113.10' },
        { label: 'vaultDisplayName', value: 'vault-prod-paris' },
        { label: 'region', value: 'eu-west-par' },
        { label: 'licenseType', value: LicenseApiValue.VDP_PREMIUM },
      ]),
    );
  });

  it('never sends the private IP when the NAT toggle is off', async () => {
    const { result, onSuccess } = await renderOrderHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const emitted = await resolveApiRequests(requests);

    expect(configurations(emitted)).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'backupServerPrivateIp' })]),
    );
  });

  it('sends the private IP once the NAT toggle is on', async () => {
    const { result, onSuccess } = await renderOrderHook();

    result.current.mutate({
      form: { ...form, isBehindNat: true, backupServerPrivateIp: '192.168.1.10' },
      licenseType: LicenseApiValue.VDP_PREMIUM,
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const emitted = await resolveApiRequests(requests);

    expect(configurations(emitted)).toEqual(
      expect.arrayContaining([{ label: 'backupServerPrivateIp', value: '192.168.1.10' }]),
    );
  });

  it('exposes the contracts the simulated checkout returned, ready to gate on', async () => {
    const { result, onSuccess } = await renderOrderHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(result.current.data?.contractList).toEqual([
      expect.objectContaining({ name: 'Test contract' }),
    ]);
  });

  it('refuses to order when the cart requires a label no form value answers', async () => {
    // Les libellés du vault (`vault_name`/`vault_region`) ne sont pas ceux du tunnel : rien ne les
    // couvre, et on ne devine pas lequel des champs saisis leur correspond.
    const { result, onSuccess } = await renderOrderHook({
      cartRequiredConfiguration: mockCartRequiredConfiguration,
    });

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain(UNKNOWN_CART_CONFIGURATION);
    expect(onSuccess).not.toHaveBeenCalled();

    const emitted = await resolveApiRequests(requests);
    expect(posted(emitted, '/assign')).toHaveLength(0);
    expect(configurations(emitted)).toHaveLength(0);
  });

  it('reports a failing cart without confirming anything', async () => {
    const { result, onSuccess } = await renderOrderHook({ isOrderError: true });

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
