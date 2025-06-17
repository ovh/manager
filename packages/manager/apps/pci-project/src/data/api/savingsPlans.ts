import { v6 } from '@ovh-ux/manager-core-api';
import { SavingsPlan } from '@/data/types/savingPlan.type';

export const getSavingsPlans = async (
  serviceId: string,
): Promise<SavingsPlan[]> => {
  const { data } = await v6.get(
    `services/${serviceId}/savingsPlans/subscribed`,
  );
  return data;
};
