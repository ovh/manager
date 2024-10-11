import { HourlyInstanceOptionDetail } from '@/types/cloud/billingView/HourlyInstanceOptionDetail';
import { Quantity } from '@/types/cloud/billingView/Quantity';

/** HourlyInstanceOption */
export interface HourlyInstanceOption {
  /** Details about hourly instances option */
  details?: HourlyInstanceOptionDetail[];
  /** Quantity of instance hours running with this option */
  quantity?: Quantity;
  /** Instance reference */
  reference?: string;
  /** Instance region */
  region?: string;
  /** Total price */
  totalPrice?: number;
}
