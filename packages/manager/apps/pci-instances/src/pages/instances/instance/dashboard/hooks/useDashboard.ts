import { useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useInstance } from '@/data/hooks/instance/useInstance';
import { selectInstanceDashboard } from '../view-models/selectInstanceDashboard';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useDedicatedUrl } from '@/hooks/url/useDedicatedUrl';

type TUseDashboardArgs = {
  region: string | null;
  instanceId: string;
};

export const useDashboard = ({ region, instanceId }: TUseDashboardArgs) => {
  const projectUrl = useProjectUrl('public-cloud');
  const projectId = useProjectId();
  const dedicatedUrl = useDedicatedUrl();

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
      instance: selectInstanceDashboard(
        { projectUrl, projectId, dedicatedUrl },
        instance,
      ),
      pendingTasks,
      isPending,
      error,
    }),
    [
      instance,
      isPending,
      projectUrl,
      error,
      pendingTasks,
      projectId,
      dedicatedUrl,
    ],
  );
};
