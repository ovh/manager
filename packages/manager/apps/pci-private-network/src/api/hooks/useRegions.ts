import { useQuery } from '@tanstack/react-query';
import { getProjectRegions } from '@/api/data/regions';

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });

export const useProjectAvailableRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'available', 'regions'],
    queryFn: () => getProjectRegions(projectId),
    select: (regions) =>
      regions.filter(({ services = [] }) =>
        services.some(
          (service) => service.name === 'network' && service.status === 'UP',
        ),
      ),
  });
