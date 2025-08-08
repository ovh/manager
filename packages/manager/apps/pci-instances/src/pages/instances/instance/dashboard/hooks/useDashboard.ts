import { useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useInstance } from '@/data/hooks/instance/useInstance';
import { selectInstanceDashboard } from '../view-models/selectInstanceDashboard';
import { TInstance } from '@/types/instance/entity.type';
import { instancesQueryKey } from '@/utils';
import queryClient from '@/queryClient';

type TUseDashboardArgs = {
  region: string | null;
  instanceId: string;
};

export const useDashboard = ({ region, instanceId }: TUseDashboardArgs) => {
  const projectUrl = useProjectUrl('public-cloud');
  const { data: instance, isPending } = useInstance({
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
      isPending,
    }),
    [instance],
  );
};

type TUpdateDashboardCacheArgs = {
  projectId: string;
  instanceId: string;
  region: string;
  payload: Partial<TInstance>;
};

export const updateDashboardCache = ({
  projectId,
  instanceId,
  region,
  payload,
}: TUpdateDashboardCacheArgs) => {
  queryClient.setQueryData<TInstance>(
    instancesQueryKey(projectId, [
      'region',
      region,
      'instance',
      instanceId,
      'withBackups',
      'withImage',
      'withNetworks',
      'withVolumes',
    ]),
    (prevData) => {
      if (!prevData) return undefined;
      return { ...prevData, ...payload };
    },
  );
};
