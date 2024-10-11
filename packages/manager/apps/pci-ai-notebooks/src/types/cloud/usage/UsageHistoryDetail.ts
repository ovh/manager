import { HourlyResources } from '@/types/cloud/billingView/HourlyResources';
import { MonthlyResources } from '@/types/cloud/billingView/MonthlyResources';
import { Period } from '@/types/cloud/usage/Period';
import { TypedResources } from '@/types/cloud/billingView/TypedResources';

/** UsageHistoryDetail */
export interface UsageHistoryDetail {
  /** Hourly usage */
  hourlyUsage?: HourlyResources;
  /** Usage id */
  id?: string;
  /** Entry last update */
  lastUpdate?: string;
  /** Monthly usage */
  monthlyUsage?: MonthlyResources;
  /** Usage dates (from/to) */
  period?: Period;
  /** Resource usage (billed per hour/minute/second/unit) */
  resourcesUsage?: TypedResources[];
}
