import { Period } from '@/types/cloud/usage/Period';

/** UsageHistory */
export interface UsageHistory {
  /** Usage id */
  id?: string;
  /** Entry last update */
  lastUpdate?: string;
  /** Usage dates (from/to) */
  period?: Period;
}
