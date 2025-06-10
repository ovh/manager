import {
  useMutation,
  useQuery,
  UseQueryOptions,
  QueryKey,
} from '@tanstack/react-query';
import { editInstanceName, getInstance } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceDto } from '@/types/instance/api.type';
import { instancesQueryKey } from '@/utils';
import { DeepReadonly } from '@/types/utils.type';
import queryClient from '@/queryClient';

export type TUseInstanceQueryOptions<T> = Partial<
  Pick<
    UseQueryOptions<TInstanceDto, Error, T>,
    'enabled' | 'retry' | 'gcTime' | 'select'
  >
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

export const getInstanceQuery = <T = TInstanceDto>(
  projectId: string,
  instanceId: string,
): UseQueryOptions<TInstanceDto, Error, T, QueryKey> => ({
  queryKey: instancesQueryKey(projectId, ['instance', instanceId]),
  queryFn: () => getInstance({ projectId, instanceId }),
});

export const useInstance = <TData = TInstanceDto>(
  instanceId: string,
  queryOptions?: TUseInstanceQueryOptions<TData>,
) => {
  const projectId = useProjectId();

  return useQuery<TInstanceDto, Error, TData>({
    ...getInstanceQuery(projectId, instanceId),
    ...queryOptions,
  });
};

export const updateInstanceCache = ({
  projectId,
  instanceId,
  payload,
}: {
  projectId: string;
  instanceId: string;
  payload: Partial<Omit<TInstanceDto, 'id'>>;
}) => {
  queryClient.setQueryData<TInstanceDto>(
    instancesQueryKey(projectId, ['instance', instanceId]),
    (prevData) => {
      if (!prevData) return undefined;
      return { ...prevData, ...payload };
    },
  );
};

export const useEditInstanceName = ({
  projectId,
  instanceId,
  callbacks = {},
}: {
  projectId: string;
  instanceId: string;
  callbacks: TUseEditInstanceCallbacks;
}) => {
  const { onError, onSuccess } = callbacks;

  return useMutation({
    mutationFn: ({ instanceName }: TEditInstanceNameDto) =>
      editInstanceName({ projectId, instanceId, instanceName }),
    onSuccess,
    onError,
  });
};
