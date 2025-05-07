import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { editInstanceName, getInstance } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceDto } from '@/types/instance/api.type';
import { instancesQueryKey } from '@/utils';
import { DeepReadonly } from '@/types/utils.type';
import queryClient from '@/queryClient';

export type TUseInstanceQueryOptions = Pick<
  UseQueryOptions<TInstanceDto>,
  'enabled' | 'retry' | 'gcTime'
>;

type TEditInstanceNameDto = { instanceName: string };

type TUseEditInstanceCallbacks = DeepReadonly<{
  onSuccess?: (
    data: TInstanceDto,
    variables: TEditInstanceNameDto,
    context: unknown,
  ) => void;
  onError?: (error: unknown) => void;
}>;

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

export const useEditInstanceName = (
  instanceId: string,
  callbacks: TUseEditInstanceCallbacks = {},
) => {
  const projectId = useProjectId();
  const { onError, onSuccess } = callbacks;

  return useMutation({
    mutationFn: ({ instanceName }: TEditInstanceNameDto) =>
      editInstanceName({ projectId, instanceId, instanceName }),
    onSuccess,
    onError,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: instancesQueryKey(projectId, ['instance', instanceId]),
      }),
  });
};
