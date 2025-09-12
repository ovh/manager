import { useQuery } from "@tanstack/react-query";
import fetchPendingAgreements from "@/data/api/agreements";

export const useAgreementsPageNavigationParam = () => ({
  app: 'billing',
  path: `#/autorenew/agreements`,
});

export const usePendingAgreements = (enabled: boolean) => useQuery({
  queryKey: ['pending-agreements'],
  queryFn: fetchPendingAgreements,
  enabled,
});
