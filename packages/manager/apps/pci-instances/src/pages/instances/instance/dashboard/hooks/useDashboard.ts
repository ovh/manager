import { useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useInstance } from '@/data/hooks/instance/useInstance';
import { selectInstanceDashboard } from '../view-models/selectInstanceDashboard';

type TUseDashboardArgs = {
  region: string | null;
  instanceId: string;
};

export const useDashboard = ({ region, instanceId }: TUseDashboardArgs) => {
  const projectUrl = useProjectUrl('public-cloud');
  const { data: instance, isPending, error } = useInstance({
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
      error,
    }),
    [instance, isPending, projectUrl, error],
  );
};
