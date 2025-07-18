import {
  useMutation,
  useQuery,
  UseQueryOptions,
  QueryKey,
} from '@tanstack/react-query';
import {
  attachNetworkToInstance,
  editInstanceName,
  getInstance,
  getRegionInstanceMock,
} from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import {
  TInstanceDetailDto,
  TInstanceDto,
  TNetworkAttachedToInstanceDto,
} from '@/types/instance/api.type';
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
  region,
  payload,
}: {
  projectId: string;
  instanceId: string;
  region: string;
  payload: Partial<Omit<TInstanceDetailDto, 'id'>>;
}) => {
  queryClient.setQueryData<TInstanceDetailDto>(
    instancesQueryKey(projectId, ['instance', instanceId, 'region', region]),
    (prevData) => {
      if (!prevData) return undefined;
      return { ...prevData, ...payload };
    },
  );
};

export const getRegionInstanceQuery = <T = TInstanceDetailDto>(
  projectId: string,
  region: string,
  instanceId: string,
): UseQueryOptions<TInstanceDetailDto, Error, T, QueryKey> => ({
  queryKey: instancesQueryKey(projectId, [
    'instance',
    instanceId,
    'region',
    region,
  ]),
  queryFn: () => getRegionInstanceMock({ projectId, region, instanceId }),
});

export const useRegionInstance = <TData = TInstanceDetailDto>(
  projectId: string,
  instance: string,
  region: string,
  options?: Omit<
    UseQueryOptions<TInstanceDetailDto, Error, TData>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery<TInstanceDetailDto, Error, TData>({
    ...getRegionInstanceQuery(projectId, region, instance),
    ...options,
  });

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

export const useAttachNetworkToInstance = ({
  projectId,
  instanceId,
  networkId,
  callbacks = {},
}: {
  projectId: string;
  instanceId: string;
  networkId: string;
  callbacks: DeepReadonly<{
    onSuccess?: (data?: TNetworkAttachedToInstanceDto) => void;
    onError?: (error: unknown) => void;
  }>;
}) => {
  const { onSuccess, onError } = callbacks;

  return useMutation({
    mutationFn: () =>
      attachNetworkToInstance({ projectId, instanceId, networkId }),
    onSuccess,
    onError,
  });
};
