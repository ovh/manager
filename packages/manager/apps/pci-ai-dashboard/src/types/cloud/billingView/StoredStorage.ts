import { Quantity } from '@/types/cloud/billingView/Quantity';

/** StoredStorage */
export interface StoredStorage {
  /** GiBh stored */
  quantity?: Quantity;
  /** Total price */
  totalPrice?: number;
}
