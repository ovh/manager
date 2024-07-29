import { Quantity } from '@/types/cloud/billingView/Quantity';

/** HourlyInstanceDetail */
export interface HourlyInstanceDetail {
  /** Instance ID */
  instanceId?: string;
  /** Hours of run instances */
  quantity?: Quantity;
  /** Total price */
  totalPrice?: number;
}
