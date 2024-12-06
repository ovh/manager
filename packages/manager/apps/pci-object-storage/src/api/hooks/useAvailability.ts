import { useQuery } from '@tanstack/react-query';
import { getFeatureAvailability } from '@/api/data/feature-availablity';

export const useGetFeatureAvailability = (feature: string, app: string) => {
  const result = useQuery({
    queryKey: ['feature', feature, 'availability', app],
    queryFn: () => getFeatureAvailability(feature, app),
  });

  return {
    ...result,
    available: (result?.data || {})[`${feature}`] === true,
  };
};
