import { v6 } from '@ovh-ux/manager-core-api';
import { TEligibility } from '@/data/types/eligibility.type';

export const getEligibility = async (): Promise<TEligibility> => {
  const { data } = await v6.get<TEligibility>('/cloud/eligibility');
  return data;
};
