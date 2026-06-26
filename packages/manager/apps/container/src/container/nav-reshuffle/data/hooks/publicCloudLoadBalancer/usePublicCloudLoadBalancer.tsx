import { useQuery } from '@tanstack/react-query';
import { getPublicCloudLoadBalancers } from '@/container/nav-reshuffle/data/api/publicCloudLoadBalancer';

export const usePublicCloudLoadBalancer = (projectId?: string) =>
  useQuery({
    queryKey: ['pci-load-balancers', projectId],
    queryFn: () => getPublicCloudLoadBalancers(projectId),
    enabled: !!projectId,
    retry: false,
  });
