import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getInstance } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceDto } from '@/types/instance/api.type';
import { instancesQueryKey } from '@/utils';

export type TUseInstanceQueryOptions = Pick<
  UseQueryOptions<TInstanceDto>,
  'enabled' | 'retry'
>;

export const useInstance = (
  instanceId: string,
  queryOptions: TUseInstanceQueryOptions,
) => {
  const projectId = useProjectId();

  return useQuery({
    queryKey: instancesQueryKey(projectId, ['instance', instanceId]),
    queryFn: () => getInstance({ projectId, instanceId }),
    ...queryOptions,
  });
};
