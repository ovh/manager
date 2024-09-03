import { MonthlyInstanceOptionDetail } from '@/types/cloud/billingView/MonthlyInstanceOptionDetail';

/** MonthlyInstanceOption */
export interface MonthlyInstanceOption {
  /** Details about monthly instances */
  details?: MonthlyInstanceOptionDetail[];
  /** Instance reference */
  reference?: string;
  /** Instance region */
  region?: string;
  /** Total price */
  totalPrice?: number;
}
