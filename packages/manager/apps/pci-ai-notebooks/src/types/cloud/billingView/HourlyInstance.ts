import { HourlyInstanceDetail } from '@/types/cloud/billingView/HourlyInstanceDetail';
import { Quantity } from '@/types/cloud/billingView/Quantity';

/** HourlyInstance */
export interface HourlyInstance {
  /** Details about hourly instances */
  details?: HourlyInstanceDetail[];
  /** Hours of run instances */
  quantity?: Quantity;
  /** Instance reference */
  reference?: string;
  /** Instance region */
  region?: string;
  /** Total price */
  totalPrice?: number;
}
