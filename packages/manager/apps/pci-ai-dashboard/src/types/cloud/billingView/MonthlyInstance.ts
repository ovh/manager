import { MonthlyInstanceDetail } from '@/types/cloud/billingView/MonthlyInstanceDetail';

/** MonthlyInstance */
export interface MonthlyInstance {
  /** Details about monthly instances */
  details?: MonthlyInstanceDetail[];
  /** Instance reference */
  reference?: string;
  /** Instance region */
  region?: string;
  /** Total price */
  totalPrice?: number;
}
