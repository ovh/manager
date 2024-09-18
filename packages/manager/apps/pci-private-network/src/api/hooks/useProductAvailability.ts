import { useQuery } from '@tanstack/react-query';
import { getProductAvailability } from '@ovh-ux/manager-pci-common';
import { getProjectRegions } from '@/api/data/regions';

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
    queryFn: async () => {
      const availability = await getProductAvailability(projectId, {
        ovhSubsidiary,
        planCode,
      });
      return availability?.plans;
    },
  });
