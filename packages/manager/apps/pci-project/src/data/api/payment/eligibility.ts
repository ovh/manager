import { v6 } from '@ovh-ux/manager-core-api';
import { TEligibility } from '@/data/types/payment/eligibility.type';

export const getEligibility = async (): Promise<{ data: TEligibility }> => {
  return v6.get(`/cloud/eligibility`);
};
