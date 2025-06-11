import { v6 } from '@ovh-ux/manager-core-api';

import { SavingsPlan } from '@/data/models/SavingPlan.type';

export const getSavingsPlans = async (serviceId: string): Promise<SavingsPlan[]> => {
  const { data } = await v6.get<SavingsPlan[]>(`services/${serviceId}/savingsPlans/subscribed`);
  return data;
};
