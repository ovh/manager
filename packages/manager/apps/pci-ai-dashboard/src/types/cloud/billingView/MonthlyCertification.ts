import { MonthlyCertificationDetail } from '@/types/cloud/billingView/MonthlyCertificationDetail';

/** MonthlyCertification */
export interface MonthlyCertification {
  /** Details about certifications */
  details?: MonthlyCertificationDetail[];
  /** Certification reference */
  reference?: string;
  /** Total price */
  totalPrice?: number;
}
