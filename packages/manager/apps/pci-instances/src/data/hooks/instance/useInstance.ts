import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getInstance0 } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import { instancesQueryKey } from '@/utils';

export type TUseInstanceQueryOptions = Pick<
  UseQueryOptions<TAggregatedInstanceDto>,
  'enabled' | 'retry' | 'gcTime'
>;

export const useInstance = (
  instanceId: string,
  queryOptions: TUseInstanceQueryOptions,
) => {
  const projectId = useProjectId();

  return useQuery({
    queryKey: instancesQueryKey(projectId, ['instance', instanceId]),
    queryFn: () => getInstance0({ projectId, instanceId }),
    ...queryOptions,
  });
};
