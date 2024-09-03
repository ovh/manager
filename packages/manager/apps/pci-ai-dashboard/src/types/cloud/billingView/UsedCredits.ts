import { UsedCredit } from '@/types/cloud/billingView/UsedCredit';

/** UsedCredits */
export interface UsedCredits {
  /** Details about credits that will be used */
  details?: UsedCredit[];
  /** Total credit that will be used to pay the bill */
  totalCredit?: number;
}
