import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getInstance, TInstanceSearchParamsFilter } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { instancesQueryKey } from '@/utils';
import { TInstance } from '@/types/instance/entity.type';
import { DeepReadonly } from '@/types/utils.type';

export type TUseInstanceQueryOptions = Pick<
  UseQueryOptions<TInstance>,
  'enabled' | 'retry' | 'gcTime'
>;

type TUseInstanceParams = DeepReadonly<{
  region: string | null;
  instanceId: string;
  queryOptions: TUseInstanceQueryOptions;
  filter?: TInstanceSearchParamsFilter;
}>;

export const useInstance = ({
  region,
  instanceId,
  filter,
  queryOptions,
}: TUseInstanceParams) => {
  const projectId = useProjectId();

  const filterQueryKey = Object.keys(filter ?? []).filter(
    (key) => (filter as Record<string, boolean>)[key],
  );

  return useQuery({
    queryKey: instancesQueryKey(projectId, [
      'region',
      String(region),
      'instance',
      instanceId,
      ...filterQueryKey,
    ]),
    queryFn: () => getInstance({ projectId, region, instanceId, filter }),
    ...queryOptions,
  });
};
