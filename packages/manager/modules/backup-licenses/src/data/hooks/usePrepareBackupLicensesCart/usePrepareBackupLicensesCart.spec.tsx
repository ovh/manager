import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  UNAVAILABLE_CART_OFFER,
  UNKNOWN_CART_CONFIGURATION,
} from '@/data/api/order/order.requests';
import {
  MOCK_CART_ID,
  MOCK_CART_ITEM_ID,
  mockCartOptionDefinitionsWithoutBundledVault,
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

import { usePrepareBackupLicensesCart } from './usePrepareBackupLicensesCart';

const form: ServerVaultFormState = {
  displayName: 'backup-prod-paris',
  backupServerExternalIp: '203.0.113.10',
  isBehindNat: false,
  backupServerPrivateIp: '',
  vaultDisplayName: 'vault-prod-paris',
  regionApiValue: 'eu-west-par',
};

const renderPrepareHook = async (mockParams: MockParams = {}) => {
  setupMswMock({
    cartRequiredConfiguration: mockOrderFunnelRequiredConfiguration,
    ...mockParams,
  });
  const wrapper = await testWrapperBuilder().withQueryClient().withShellContext().build();
  const { result } = renderHook(() => usePrepareBackupLicensesCart(), { wrapper });

  return { result };
};

const posted = (requests: WatchedApiRequest[], fragment: string) =>
  requests.filter(({ method, url }) => method === 'POST' && url.includes(fragment));

const cartPath = (url: string) => url.replace(/^.*\/order\/cart/, '/order/cart');

const isDefinitionRead = ({ method, url }: WatchedApiRequest) =>
  method === 'GET' && url.includes('/backupServices');

const configurations = (requests: WatchedApiRequest[]) =>
  posted(requests, '/configuration').map(({ body }) => body);

describe('usePrepareBackupLicensesCart', () => {
  let requests: Promise<WatchedApiRequest>[];

  beforeEach(() => {
    vi.clearAllMocks();
    requests = watchApiRequests('/order/cart');
  });

  afterEach(() => {
    stopWatchingApiCalls();
  });

  it('walks the cart in order: item, addons, assign, then the checkout that only simulates', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const emitted = await resolveApiRequests(requests);
    const sequence = emitted
      .filter(({ method }) => method === 'POST')
      .map(({ url }) => cartPath(url))
      .filter((url) => !url.includes('/configuration'));

    expect(sequence).toEqual([
      '/order/cart',
      `/order/cart/${MOCK_CART_ID}/backupServices`,
      `/order/cart/${MOCK_CART_ID}/backupServices/options`,
      `/order/cart/${MOCK_CART_ID}/backupServices/options`,
      `/order/cart/${MOCK_CART_ID}/backupServices/options`,
      `/order/cart/${MOCK_CART_ID}/assign`,
    ]);
    expect(
      emitted.filter(({ method, url }) => method === 'GET' && url.includes('/checkout')),
    ).toHaveLength(1);
  });

  it('never engages the order: the checkout is only read, never posted', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const emitted = await resolveApiRequests(requests);

    expect(posted(emitted, '/checkout')).toHaveLength(0);
  });

  it('asks the cart what it offers before posting a single item', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const emitted = await resolveApiRequests(requests);
    const definitionReads = emitted.filter(isDefinitionRead);
    const firstItemPost = emitted.findIndex(
      ({ method, url }) => method === 'POST' && url.endsWith('/backupServices'),
    );

    expect(definitionReads.map(({ url }) => cartPath(url))).toEqual([
      `/order/cart/${MOCK_CART_ID}/backupServices`,
      `/order/cart/${MOCK_CART_ID}/backupServices/options?planCode=${BACKUP_LICENSES_ORDER_PLAN_CODES.tenant}`,
      `/order/cart/${MOCK_CART_ID}/backupServices/options?planCode=${BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenant}`,
    ]);
    expect(emitted.slice(firstItemPost).some(isDefinitionRead)).toBe(false);
  });

  it('composes the tenant and its three addons of R2 on the conditions the cart announced', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
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
    expect(posted(emitted, '/backupServices/options').map(({ body }) => body)).toEqual([
      {
        planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenant,
        duration: 'P1M',
        pricingMode: 'default',
        quantity: 1,
        itemId: MOCK_CART_ITEM_ID,
      },
      {
        planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenantLicenses,
        duration: 'P1M',
        pricingMode: 'consumption',
        quantity: 1,
        itemId: MOCK_CART_ITEM_ID,
      },
      {
        planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.bundledVault,
        duration: 'P1Y',
        pricingMode: 'default',
        quantity: 2,
        itemId: MOCK_CART_ITEM_ID,
      },
    ]);
  });

  it('answers each label the cart asks for, on every item that asks for it', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const emitted = await resolveApiRequests(requests);
    const answered = configurations(emitted);

    expect(answered).toHaveLength(12);
    expect(answered).toEqual(
      expect.arrayContaining([
        { label: 'backupserver-public-ip', value: '203.0.113.10' },
        { label: 'license-type', value: LicenseApiValue.VDP_PREMIUM },
        { label: 'vault-azname', value: 'eu-west-par' },
      ]),
    );
  });

  it('never sends the VBR server name nor the vault name', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const emitted = await resolveApiRequests(requests);

    expect(JSON.stringify(configurations(emitted))).not.toMatch(
      /backup-prod-paris|vault-prod-paris/,
    );
  });

  it('never sends the private IP when the NAT toggle is off', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const emitted = await resolveApiRequests(requests);

    expect(configurations(emitted)).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'backupserver-private-ip' })]),
    );
  });

  it('sends the private IP once the NAT toggle is on', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({
      form: { ...form, isBehindNat: true, backupServerPrivateIp: '192.168.1.10' },
      licenseType: LicenseApiValue.VDP_PREMIUM,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const emitted = await resolveApiRequests(requests);

    expect(configurations(emitted)).toEqual(
      expect.arrayContaining([{ label: 'backupserver-private-ip', value: '192.168.1.10' }]),
    );
  });

  it('hands back the cart and the contracts the simulated checkout returned', async () => {
    const { result } = await renderPrepareHook();

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.cartId).toBe(MOCK_CART_ID);
    expect(result.current.data?.contractList).toEqual([
      expect.objectContaining({ name: 'Test contract' }),
    ]);
  });

  it('refuses to order when the cart does not offer a plan of the composition', async () => {
    const { result } = await renderPrepareHook({
      cartOptionDefinitions: mockCartOptionDefinitionsWithoutBundledVault,
    });

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain(
      `${UNAVAILABLE_CART_OFFER}: ${BACKUP_LICENSES_ORDER_PLAN_CODES.bundledVault}`,
    );

    const emitted = await resolveApiRequests(requests);
    expect(posted(emitted, '/backupServices')).toHaveLength(0);
    expect(posted(emitted, '/assign')).toHaveLength(0);
  });

  it('refuses to order when the cart requires a label no form value answers', async () => {
    const { result } = await renderPrepareHook({
      cartRequiredConfiguration: mockCartRequiredConfiguration,
    });

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain(UNKNOWN_CART_CONFIGURATION);

    const emitted = await resolveApiRequests(requests);
    expect(posted(emitted, '/assign')).toHaveLength(0);
    expect(configurations(emitted)).toHaveLength(0);
  });

  it('reports a failing cart without confirming anything', async () => {
    const { result } = await renderPrepareHook({ isOrderError: true });

    result.current.mutate({ form, licenseType: LicenseApiValue.VDP_PREMIUM });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
