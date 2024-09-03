import { MonthlyCertification } from '@/types/cloud/billingView/MonthlyCertification';
import { MonthlyInstance } from '@/types/cloud/billingView/MonthlyInstance';
import { MonthlyInstanceOption } from '@/types/cloud/billingView/MonthlyInstanceOption';

/** MonthlyResources */
export interface MonthlyResources {
  /** Details about certifications */
  certification?: MonthlyCertification[];
  /** Details about monthly instances */
  instance?: MonthlyInstance[];
  /** Details about monthly instances options */
  instanceOption?: MonthlyInstanceOption[];
}
