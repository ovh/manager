import { Quantity } from '@/types/cloud/billingView/Quantity';

/** BandwidthStorage */
export interface BandwidthStorage {
  /** Total bandwidth in GiB */
  quantity?: Quantity;
  /** Total price */
  totalPrice?: number;
}
