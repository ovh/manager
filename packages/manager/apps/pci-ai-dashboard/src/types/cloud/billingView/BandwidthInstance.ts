import { Quantity } from '@/types/cloud/billingView/Quantity';

/** BandwidthInstance */
export interface BandwidthInstance {
  /** Total bandwidth in GiB */
  quantity?: Quantity;
  /** Total price */
  totalPrice?: number;
}
