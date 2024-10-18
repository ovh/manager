import { Quantity } from '@/types/cloud/billingView/Quantity';

/** HourlyInstanceOptionDetail */
export interface HourlyInstanceOptionDetail {
  /** Instance ID */
  instanceId?: string;
  /** Quantity of instance hours running with this option */
  quantity?: Quantity;
  /** Total price */
  totalPrice?: number;
}
