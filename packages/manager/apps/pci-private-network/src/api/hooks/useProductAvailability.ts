import { useQuery } from '@tanstack/react-query';
import { getProductAvailability, getProjectRegions } from '@/api/data/regions';

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });

export const useProductAvailability = (
  projectId: string,
  ovhSubsidiary: string,
  planCode: string,
) =>
  useQuery({
    queryKey: ['project', projectId, 'availability', ovhSubsidiary, planCode],
    queryFn: () => getProductAvailability(projectId, ovhSubsidiary, planCode),
  });
