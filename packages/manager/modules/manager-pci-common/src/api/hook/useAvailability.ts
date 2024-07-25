import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovhcloud/manager-components';
import { getProductAvailability } from '../data/availability';

export const getProductAvailabilityQuery = (
  projectId: string,
  ovhSubsidiary: string,
) => ({
  queryKey: ['product-availability', projectId, ovhSubsidiary],
  queryFn: () => getProductAvailability(projectId, ovhSubsidiary),
});

export const useProductAvailability = (projectId: string) => {
  const { me } = useMe();
  return useQuery({
    ...getProductAvailabilityQuery(projectId, me?.ovhSubsidiary),
    enabled: !!me,
  });
};
