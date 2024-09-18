import { useQuery } from '@tanstack/react-query';
import { getInstances } from '@ovh-ux/manager-pci-common';
import { getInstance, Instance } from '@/api/data/instance';

export const getInstanceQueryKey = (projectId: string, instanceId: string) => [
  'instance',
  projectId,
  instanceId,
];

export const useInstance = (projectId: string, instanceId: string) =>
  useQuery({
    queryKey: getInstanceQueryKey(projectId, instanceId),
    queryFn: (): Promise<Required<Instance>> =>
      getInstance(projectId, instanceId),
    enabled: !!instanceId,
  });

export const getInstancesQueryKey = (projectId: string, region: string) => [
  'instances',
  projectId,
  region,
];

export const useInstances = (projectId: string, region: string) =>
  useQuery({
    queryKey: getInstancesQueryKey(projectId, region),
    queryFn: (): Promise<Required<Instance>[]> =>
      getInstances(projectId, region) as Promise<Required<Instance>[]>,
    enabled: !!region,
  });
