import { Quantity } from '@/types/cloud/billingView/Quantity';

/** InstanceSnapshot */
export interface InstanceSnapshot {
  /** GiBh stored */
  quantity?: Quantity;
  /** Total price */
  totalPrice?: number;
}
