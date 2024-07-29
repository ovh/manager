import { Quantity } from '@/types/cloud/billingView/Quantity';

/** VolumeSnapshot */
export interface VolumeSnapshot {
  /** GiBh stored */
  quantity?: Quantity;
  /** Total price */
  totalPrice?: number;
}
