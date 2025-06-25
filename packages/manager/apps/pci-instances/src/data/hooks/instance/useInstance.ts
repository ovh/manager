import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getInstance, TGetInstanceQueryParams } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { instancesQueryKey } from '@/utils';
import { TInstance } from '@/types/instance/entity.type';
import { DeepReadonly } from '@/types/utils.type';

export type TUseInstanceQueryOptions = Pick<
  UseQueryOptions<TInstance>,
  'enabled' | 'retry' | 'gcTime'
>;

type TUseInstanceArgs = DeepReadonly<{
  region: string | null;
  instanceId: string;
  params?: TGetInstanceQueryParams;
  queryOptions?: TUseInstanceQueryOptions;
}>;

export const useInstance = ({
  region,
  instanceId,
  params,
  queryOptions,
}: TUseInstanceArgs) => {
  const projectId = useProjectId();

  return useQuery({
    queryKey: instancesQueryKey(projectId, [
      'region',
      String(region),
      'instance',
      instanceId,
      ...(params ?? []),
    ]),
    queryFn: () => getInstance({ projectId, region, instanceId, params }),
    ...queryOptions,
  });
};
