import { useQuery } from '@tanstack/react-query';
import {
  getProductRegionsAvailability,
  getProjectRegionDetails,
} from '@/api/data/region';

export const useProjectRegionDetails = (projectId: string, region: string) =>
  useQuery({
    queryKey: ['projectId', projectId, 'region', region],
    queryFn: () => getProjectRegionDetails(projectId, region),
    enabled: !!projectId && !!region,
  });

export const useProductRegionsAvailability = (
  ovhSubsidiary: string,
  planCode: string,
) =>
  useQuery({
    queryKey: [
      'cloud/order/rule/availability/ovhSubsidiary',
      ovhSubsidiary,
      'planCode',
      planCode,
    ],
    queryFn: () => getProductRegionsAvailability(ovhSubsidiary, planCode),
    enabled: !!ovhSubsidiary,
  });
