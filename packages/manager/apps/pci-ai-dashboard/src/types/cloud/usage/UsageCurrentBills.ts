import { UsageBill } from '@/types/cloud/usage/UsageBill';

/** UsageCurrentBills */
export interface UsageCurrentBills {
  /** Bills related to the current usage */
  bills?: UsageBill[];
}
