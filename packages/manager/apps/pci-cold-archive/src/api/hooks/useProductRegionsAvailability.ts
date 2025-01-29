import { useQuery } from '@tanstack/react-query';
import {
  getArchiveRegionDetails,
  getProductRegionsAvailability,
} from '../data/region';

export const useProductRegionsAvailability = (ovhSubsidiary: string) => {
  return useQuery({
    queryKey: ['ovhSubsidiary', ovhSubsidiary],
    queryFn: () => getProductRegionsAvailability(ovhSubsidiary),
    enabled: !!ovhSubsidiary,
  });
};

export const useArchiveRegionDetails = (projectId: string, region: string) => {
  return useQuery({
    queryKey: ['projectId', projectId, 'region', region],
    queryFn: () => getArchiveRegionDetails(projectId, region),
    enabled: !!projectId && !!region,
  });
};
