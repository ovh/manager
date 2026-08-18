import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCAL_STORAGE_KEYS, PENDING_ORDER_MAX_AGE_MS } from '@/module.constants';
import { LicenseFamily, VdpTier } from '@/types/Order.type';
import { PendingOrder, PendingOrderContent } from '@/types/PendingOrder.type';

type PendingOrderState = {
  pendingOrder: PendingOrder | null;
  registerPendingOrder: (pendingOrder: PendingOrder) => void;
  clearPendingOrder: () => void;
};

const isPendingOrderContent = (value: unknown): value is PendingOrderContent => {
  if (typeof value !== 'object' || value === null) return false;
  const { family, tier, form } = value as Partial<PendingOrderContent>;
  return (
    (family === null || Object.values(LicenseFamily).includes(family as LicenseFamily)) &&
    (tier === null || Object.values(VdpTier).includes(tier as VdpTier)) &&
    typeof form === 'object' &&
    form !== null
  );
};

const isPendingOrder = (value: unknown): value is PendingOrder => {
  if (typeof value !== 'object' || value === null) return false;
  const { cartId, submittedAt, orderId, order } = value as Partial<PendingOrder>;
  return (
    typeof cartId === 'string' &&
    typeof submittedAt === 'number' &&
    Number.isFinite(submittedAt) &&
    (orderId === null || typeof orderId === 'number') &&
    isPendingOrderContent(order)
  );
};

export const rehydratePendingOrder = (
  persisted: unknown,
  now: number = Date.now(),
): PendingOrder | null => {
  const candidate = (persisted as { pendingOrder?: unknown } | null)?.pendingOrder;

  if (!isPendingOrder(candidate)) return null;
  if (now - candidate.submittedAt > PENDING_ORDER_MAX_AGE_MS) return null;

  return candidate;
};

export const usePendingOrderStore = create<PendingOrderState>()(
  persist(
    (set) => ({
      pendingOrder: null,
      registerPendingOrder: (pendingOrder) => set({ pendingOrder }),
      clearPendingOrder: () => set({ pendingOrder: null }),
    }),
    {
      name: LOCAL_STORAGE_KEYS.PENDING_ORDER,
      partialize: ({ pendingOrder }) => ({ pendingOrder }),
      merge: (persisted, current) => ({
        ...current,
        pendingOrder: rehydratePendingOrder(persisted),
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.pendingOrder) usePendingOrderStore.persist.clearStorage();
      },
    },
  ),
);

export const usePendingOrder = (): PendingOrder | null =>
  usePendingOrderStore((state) => state.pendingOrder);

export const registerPendingOrder = (pendingOrder: PendingOrder): void =>
  usePendingOrderStore.getState().registerPendingOrder(pendingOrder);

export const clearPendingOrder = (): void => usePendingOrderStore.getState().clearPendingOrder();

export const resetPendingOrderStore = (): void => {
  usePendingOrderStore.setState({ pendingOrder: null });
  usePendingOrderStore.persist.clearStorage();
};
