import { useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { QueryClient } from '@tanstack/react-query';
import {
  updateInstanceFromCache,
  useInstance,
} from '@/data/hooks/instance/useInstance';
import { selectInstanceDashboard } from '../view-models/selectInstanceDashboard';
import { TPartialInstance } from '@/types/instance/entity.type';
import { updateInstancesFromCache } from '@/data/hooks/instance/useInstances';
import { buildPartialAggregatedInstanceDto } from '@/data/hooks/instance/builder/instanceDto.builder';

type TUseDashboardArgs = {
  region: string | null;
  instanceId: string;
};

export const useDashboard = ({ region, instanceId }: TUseDashboardArgs) => {
  const projectUrl = useProjectUrl('public-cloud');
  const { data: instance, isPending, error, pendingTasks } = useInstance({
    region,
    instanceId,
    params: ['withBackups', 'withImage', 'withNetworks', 'withVolumes'],
    queryOptions: {
      gcTime: 0,
    },
  });

  return useMemo(
    () => ({
      instance: selectInstanceDashboard(projectUrl, instance),
      pendingTasks,
      isPending,
      error,
    }),
    [instance, isPending, projectUrl, error, pendingTasks],
  );
};

type TUpdateInstanceFromAllCacheArgs = {
  projectId: string;
  instance: TPartialInstance;
  region?: string;
};

export const updateInstanceFromAllCaches = (
  queryClient: QueryClient,
  { projectId, instance, region }: TUpdateInstanceFromAllCacheArgs,
) => {
  updateInstancesFromCache(queryClient, {
    projectId,
    instance: buildPartialAggregatedInstanceDto(instance),
  });

  updateInstanceFromCache({
    queryClient,
    projectId,
    instance,
    region,
  });
};
