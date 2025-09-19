import { useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useInstance } from '@/data/hooks/instance/useInstance';
import { selectInstanceDashboard } from '../view-models/selectInstanceDashboard';
import { useDedicatedUrl } from '@/hooks/url/useDedicatedUrl';

type TUseDashboardArgs = {
  region: string | null;
  instanceId: string;
};

export const useDashboard = ({ region, instanceId }: TUseDashboardArgs) => {
  const projectUrl = useProjectUrl('public-cloud');
  const dedicatedUrl = useDedicatedUrl();

  const { data: instance, isPending, error, pendingTasks } = useInstance({
    region,
    instanceId,
    params: ['withBackups', 'withImage', 'withNetworks', 'withVolumes'],
    queryOptions: {
      gcTime: 0,
      refetchOnWindowFocus: 'always',
    },
  });

  return useMemo(
    () => ({
      instance: selectInstanceDashboard({ projectUrl, dedicatedUrl }, instance),
      pendingTasks,
      isPending,
      error,
    }),
    [instance, isPending, projectUrl, error, pendingTasks, dedicatedUrl],
  );
};
