import { UsageBill } from '@/types/cloud/usage/UsageBill';

/** UsageHistoryDetailBills */
export interface UsageHistoryDetailBills {
  /** Bills related to the usage */
  bills?: UsageBill[];
}
