import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getProductAvailability } from '../data/availability';

export const getProductAvailabilityQuery = (
  projectId: string,
  ovhSubsidiary: string,
  product?: string,
) => ({
  queryKey: [
    'product-availability',
    projectId,
    ovhSubsidiary,
    product || 'all',
  ],
  queryFn: () =>
    getProductAvailability(projectId, {
      ovhSubsidiary,
      product,
    }),
});

export const useProductAvailability = (projectId: string, product?: string) => {
  const { me } = useMe();
  return useQuery({
    ...getProductAvailabilityQuery(projectId, me?.ovhSubsidiary, product),
    enabled: !!me,
  });
};
