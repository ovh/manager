import { useQuery } from '@tanstack/react-query';
import { useMe } from '@/api/hooks/useMe';
import { getAvailableGatewayPlans } from '@/api/data/gateway-plans';

export const getAvailableGatewayPlansQuery = (
  projectId: string,
  ovhSubsidiary: string,
) => ({
  queryKey: ['project', projectId, 'availableGatewayPlans'],
  queryFn: () => getAvailableGatewayPlans(projectId, ovhSubsidiary),
});

export const useAvailableGatewayPlans = (projectId: string) => {
  const { me } = useMe();
  return useQuery({
    ...getAvailableGatewayPlansQuery(projectId, me?.ovhSubsidiary),
    enabled: !!projectId && !!me?.ovhSubsidiary,
  });
};
