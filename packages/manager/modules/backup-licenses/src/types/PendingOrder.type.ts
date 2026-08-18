import { LicenseFamily, ServerVaultFormState, VdpTier } from '@/types/Order.type';

export type PendingOrderContent = {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  form: ServerVaultFormState;
};

export type PendingOrder = {
  orderId: number | null;
  cartId: string;
  submittedAt: number;
  order: PendingOrderContent;
};
