import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import { getSavingsPlans } from '@/data/api/savingsPlans';
import { SavingsPlan } from '@/data/types/savingPlan.type';

/**
 * Generates a unique query key for fetching savings plans of a service.
 * @param serviceId - The ID of the service.
 * @returns An array representing the query key.
 */
export const getSavingsPlansQueryKey = (serviceId: string): [string] => [
  `services/${serviceId}/savingsPlans/subscribed`,
];

/**
 * Returns the options object for useQuery to fetch savings plans for a given service.
 * @param serviceId - The ID of the service.
 * @param isSavingsPlansAvailable - Flag indicating if savings plans feature is available
 * @returns The options object for useQuery.
 */
export const getSavingsPlansQueryOptions = (
  serviceId: string,
  isSavingsPlansAvailable: boolean,
): UseQueryOptions<SavingsPlan[]> => ({
  queryKey: getSavingsPlansQueryKey(serviceId),
  queryFn: () => getSavingsPlans(serviceId),
  enabled: Boolean(serviceId) && isSavingsPlansAvailable,
  throwOnError: true,
});

/**
 * Custom hook to fetch savings plans for a given service.
 * @param serviceId - The ID of the service.
 * @param isSavingsPlansAvailable - Flag indicating if savings plans feature is available
 * @returns The result of the useQuery hook.
 */
export const useSavingsPlans = (
  serviceId: string,
  isSavingsPlansAvailable: boolean,
): UseQueryResult<SavingsPlan[]> =>
  useQuery<SavingsPlan[]>(
    getSavingsPlansQueryOptions(serviceId, isSavingsPlansAvailable),
  );

/**
 * Custom hook to check if there is any active or pending savings plan for a given service.
 * @param serviceId - The ID of the service to check for savings plans
 * @param isSavingsPlansAvailable - Flag indicating if savings plans feature is available
 * @returns UseQueryResult<boolean>
 */
export const useHasActiveOrPendingSavingsPlan = (
  serviceId: string,
  isSavingsPlansAvailable: boolean,
): UseQueryResult<boolean> =>
  useQuery({
    ...getSavingsPlansQueryOptions(serviceId, isSavingsPlansAvailable),
    select: (savingsPlans) =>
      savingsPlans?.some(
        (plan: { status?: string }) =>
          plan.status === 'ACTIVE' || plan.status === 'PENDING',
      ),
  });
