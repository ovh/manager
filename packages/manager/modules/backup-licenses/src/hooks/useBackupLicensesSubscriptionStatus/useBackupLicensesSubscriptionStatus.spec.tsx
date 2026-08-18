import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { MockParams, setupMswMock } from '@/test-utils/setupMsw';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { LicenseFamily } from '@/types/Order.type';
import { PendingOrder } from '@/types/PendingOrder.type';
import { SubscriptionStatus } from '@/types/Subscription.type';

import { registerPendingOrder, resetPendingOrderStore } from '../usePendingOrder/usePendingOrder';
import { useBackupLicensesSubscriptionStatus } from './useBackupLicensesSubscriptionStatus';

const A_PENDING_ORDER: PendingOrder = {
  orderId: 7,
  cartId: 'cart-7',
  submittedAt: Date.now(),
  order: {
    family: LicenseFamily.ENTERPRISE_PLUS,
    tier: null,
    form: {
      displayName: 'vbr-1',
      backupServerExternalIp: '203.0.113.10',
      isBehindNat: false,
      backupServerPrivateIp: '',
      vaultDisplayName: 'vault-1',
      regionApiValue: 'eu-west-par',
    },
  },
};

const renderStatus = async (mockParams: MockParams = {}) => {
  setupMswMock(mockParams);
  const wrapper = await testWrapperBuilder().withQueryClient().withShellContext().build();
  return renderHook(() => useBackupLicensesSubscriptionStatus(), { wrapper });
};

describe('useBackupLicensesSubscriptionStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    resetPendingOrderStore();
  });

  afterEach(() => {
    window.localStorage.clear();
    resetPendingOrderStore();
  });

  it('reports READY when a Backup Licenses tenant is delivered', async () => {
    const { result } = await renderStatus();

    await waitFor(() => expect(result.current.status).toBe(SubscriptionStatus.READY));
  });

  it('reports NONE when the account holds nothing and never ordered', async () => {
    const { result } = await renderStatus({ vspcTenants: [] });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status).toBe(SubscriptionStatus.NONE);
  });

  it('reports PENDING while the tenant is still being created', async () => {
    const { result } = await renderStatus({
      vspcTenants: [{ ...buildBackupLicensesVspcTenant('creating-1'), resourceStatus: 'CREATING' }],
    });

    await waitFor(() => expect(result.current.status).toBe(SubscriptionStatus.PENDING));
  });

  it('reports PENDING on the sole strength of the local trace, before any resource exists', async () => {
    registerPendingOrder(A_PENDING_ORDER);
    const { result } = await renderStatus({ vspcTenants: [] });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status).toBe(SubscriptionStatus.PENDING);
    expect(result.current.pendingOrder).toEqual(A_PENDING_ORDER);
  });

  it('drops the local trace once the delivery is honoured', async () => {
    registerPendingOrder(A_PENDING_ORDER);
    const { result } = await renderStatus();

    await waitFor(() => expect(result.current.status).toBe(SubscriptionStatus.READY));
    await waitFor(() => expect(result.current.pendingOrder).toBeNull());
  });

  it('reports the failed delivery rather than polling forever', async () => {
    const { result } = await renderStatus({
      vspcTenants: [{ ...buildBackupLicensesVspcTenant('failed-1'), resourceStatus: 'ERROR' }],
    });

    await waitFor(() => expect(result.current.status).toBe(SubscriptionStatus.ERROR));
  });
});
