import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getInstance } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { instancesQueryKey } from '@/utils';
import { TInstanceDto } from '@/types/instance/api.type';

export const useInstancesPolling = (
  pendingTaskIds: string[],
  cb: (data: TInstanceDto) => void,
) => {
  const projectId = useProjectId();

  const polledInstances = useQueries({
    queries: pendingTaskIds.map((id) => ({
      queryKey: instancesQueryKey(projectId, ['instance', id]),
      queryFn: () =>
        getInstance({
          projectId,
          instanceId: id,
        }),
      refetchInterval: (query) => (query.state.error ? false : 5000),
      refetchIntervalInBackground: true,
      gcTime: 0,
    })),
    combine: (results) =>
      results.map(({ data, isFetching }, index) => ({
        id: pendingTaskIds[index],
        isFetching,
        data,
      })),
  });

  polledInstances.forEach(({ data }) => {
    if (data && !data.pendingTask) {
      cb(data);
    }
  });

  return useMemo(() => polledInstances, [polledInstances]);
};
