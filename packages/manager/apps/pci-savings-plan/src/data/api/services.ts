import { v6 } from '@ovh-ux/manager-core-api';

export const getServices = async (projectId: string): Promise<number[]> => {
  const { data } = await v6.get<number[]>(`services?resourceName=${projectId}`);
  return data;
};

export const cancelSavingsPlan = async (
  serviceId: number,
  savingsPlanId: string,
) => {
  const { data } = await v6.post(
    `/services/${serviceId}/savingsPlans/subscribed/${savingsPlanId}/terminate`,
    {},
  );

  return data;
};
