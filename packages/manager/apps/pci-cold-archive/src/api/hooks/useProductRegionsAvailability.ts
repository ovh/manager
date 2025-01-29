import { useQuery } from '@tanstack/react-query';
import { getProductRegionsAvailability } from '../data/region';

export const useProductRegionsAvailability = (ovhSubsidiary: string) => {
  return useQuery({
    queryKey: ['ovhSubsidiary', ovhSubsidiary],
    queryFn: () => getProductRegionsAvailability(ovhSubsidiary),
    enabled: !!ovhSubsidiary,
  });
};
