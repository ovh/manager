import { v6 } from '@ovh-ux/manager-core-api';
import { useQueries } from '@tanstack/react-query';
import { TSavingsPlan } from '@/api/hook/useConsumption';

export interface SavingsPlanService {
  id: string;
  model: string;
  flavor: string;
  displayName: string;
}

const getSavingsPlanDetails = async (
  serviceId: string,
  savingsPlanId: string,
): Promise<SavingsPlanService> => {
  const { data } = await v6.get<SavingsPlanService>(
    `/services/${serviceId}/savingsPlans/subscribed/${savingsPlanId}`,
  );
  return data;
};

export const useSavingsPlanDetails = (
  serviceId: string,
  savingsPlans: TSavingsPlan[],
) => {
  const queries = useQueries({
    queries: savingsPlans.map((plan) => ({
      queryKey: ['savings-plan-details', serviceId, plan.id],
      queryFn: () => getSavingsPlanDetails(serviceId, plan.id),
      enabled: !!serviceId && !!plan.id,
    })),
  });

  const enrichedSavingsPlans = savingsPlans.map((plan, index) => {
    const query = queries[index];
    return {
      ...plan,
      displayName: query.data?.displayName || plan.id,
      isLoading: query.isLoading,
      error: query.error,
    };
  });

  return {
    enrichedSavingsPlans,
    isLoading: queries.some((query) => query.isLoading),
    hasErrors: queries.some((query) => query.error),
  };
};
