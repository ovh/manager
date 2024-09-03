import { ContractTermsLocale } from '@/types/cloud/project/ai/partner/ContractTermsLocale';

/** Representation of a partner's contract with logged in user's tenant */
export interface Contract {
  /** Contract signature date for the logged in user's tenant */
  signedAt?: string;
  /** Map of terms of service details per locale */
  termsOfService?: { [key: string]: ContractTermsLocale };
}
