import { useQuery } from '@tanstack/react-query';
import { getInstances } from '@ovh-ux/manager-pci-common';
import { getInstancesUrl } from '@/api/data/instances';

export const getInstancesQuery = (projectId: string) => ({
  queryKey: [getInstancesUrl(projectId)],
  queryFn: () => getInstances(projectId),
});

export const useInstances = (projectId: string) => {
  return useQuery({
    ...getInstancesQuery(projectId),
  });
};
