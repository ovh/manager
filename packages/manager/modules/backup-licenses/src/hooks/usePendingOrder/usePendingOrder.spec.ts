import { afterEach, describe, expect, it } from 'vitest';

import { LOCAL_STORAGE_KEYS, PENDING_ORDER_MAX_AGE_MS } from '@/module.constants';
import { LicenseFamily, VdpTier } from '@/types/Order.type';
import { PendingOrder } from '@/types/PendingOrder.type';

import {
  clearPendingOrder,
  registerPendingOrder,
  rehydratePendingOrder,
  resetPendingOrderStore,
  usePendingOrderStore,
} from './usePendingOrder';

const NOW = 1_770_000_000_000;

const aPendingOrder = (overrides: Partial<PendingOrder> = {}): PendingOrder => ({
  orderId: 42,
  cartId: 'cart-1',
  submittedAt: NOW,
  order: {
    family: LicenseFamily.DATA_PLATFORM,
    tier: VdpTier.PREMIUM,
    form: {
      displayName: 'vbr-1',
      backupServerExternalIp: '203.0.113.10',
      veeamClientIp: '',
      isBehindNat: false,
      backupServerPrivateIp: '',
      vaultDisplayName: 'vault-1',
      regionApiValue: 'eu-west-par',
    },
  },
  ...overrides,
});

afterEach(() => resetPendingOrderStore());

describe('usePendingOrderStore', () => {
  it('holds the order the checkout confirmed, and persists it', () => {
    const placed = aPendingOrder();

    registerPendingOrder(placed);

    expect(usePendingOrderStore.getState().pendingOrder).toEqual(placed);
    expect(window.localStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_ORDER)).toContain('cart-1');
  });

  it('holds nothing until an order is actually placed', () => {
    expect(usePendingOrderStore.getState().pendingOrder).toBeNull();
  });

  it('drops the order when the tracking is abandoned', () => {
    registerPendingOrder(aPendingOrder());

    clearPendingOrder();

    expect(usePendingOrderStore.getState().pendingOrder).toBeNull();
  });
});

describe('rehydratePendingOrder', () => {
  it('brings back a well-formed and recent trace', () => {
    const placed = aPendingOrder();

    expect(rehydratePendingOrder({ pendingOrder: placed }, NOW)).toEqual(placed);
  });

  it('brings back nothing when the storage holds nothing', () => {
    expect(rehydratePendingOrder(null, NOW)).toBeNull();
    expect(rehydratePendingOrder({}, NOW)).toBeNull();
  });

  it('refuses a trace older than its maximum age, rather than locking the customer out of the onboarding', () => {
    const stale = aPendingOrder({ submittedAt: NOW - PENDING_ORDER_MAX_AGE_MS - 1 });

    expect(rehydratePendingOrder({ pendingOrder: stale }, NOW)).toBeNull();
  });

  it('keeps a trace that is still within its maximum age', () => {
    const fresh = aPendingOrder({ submittedAt: NOW - PENDING_ORDER_MAX_AGE_MS + 1_000 });

    expect(rehydratePendingOrder({ pendingOrder: fresh }, NOW)).toEqual(fresh);
  });

  it('refuses a payload that does not have the shape of an order', () => {
    expect(rehydratePendingOrder({ pendingOrder: { cartId: 'cart-1' } }, NOW)).toBeNull();
    expect(rehydratePendingOrder({ pendingOrder: 'nope' }, NOW)).toBeNull();
    expect(
      rehydratePendingOrder({ pendingOrder: aPendingOrder({ cartId: undefined as never }) }, NOW),
    ).toBeNull();
  });
});
