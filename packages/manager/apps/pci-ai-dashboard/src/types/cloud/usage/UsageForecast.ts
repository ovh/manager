import { HourlyResources } from '@/types/cloud/billingView/HourlyResources';
import { MonthlyResources } from '@/types/cloud/billingView/MonthlyResources';
import { Period } from '@/types/cloud/usage/Period';
import { TypedResources } from '@/types/cloud/billingView/TypedResources';
import { UsedCredits } from '@/types/cloud/billingView/UsedCredits';

/** UsageForecast */
export interface UsageForecast {
  /** Hourly forecast */
  hourlyUsage?: HourlyResources;
  /** Entry last update */
  lastUpdate?: string;
  /** Monthly forecast */
  monthlyUsage?: MonthlyResources;
  /** Forecast dates (from/to) */
  period?: Period;
  /** Resource usage forecast (billed per hour/minute/second/unit) */
  resourcesUsage?: TypedResources[];
  /** Usable credit to pay next bill */
  usableCredits?: UsedCredits;
}
