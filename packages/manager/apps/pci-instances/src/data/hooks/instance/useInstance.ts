import {
  useQuery,
  UseQueryOptions,
  useMutation,
  QueryClient,
  Query,
} from '@tanstack/react-query';
import {
  attachNetwork,
  attachVolume,
  getInstance,
  TGetInstanceQueryParams,
  updateInstanceName,
} from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { instancesQueryKey } from '@/utils';
import { TInstance, TPartialInstance } from '@/types/instance/entity.type';
import { DeepReadonly } from '@/types/utils.type';
import queryClient from '@/queryClient';

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
    ...queryOptions,
    queryKey: instancesQueryKey(projectId, [
      'region',
      String(region),
      'instance',
      instanceId,
      ...(params ?? []),
    ]),
    queryFn: () => getInstance({ projectId, region, instanceId, params }),
  });
};

type TInstanceNameMutationFnVariables = { instanceName: string };

type TUpdateInstanceCallbacks = DeepReadonly<{
  onSuccess?: (
    data: null,
    variables: TInstanceNameMutationFnVariables,
    context: unknown,
  ) => void;
  onError?: (error: unknown) => void;
}>;

type TUpdateInstanceNameArgs = {
  projectId: string;
  instanceId: string;
  callbacks?: TUpdateInstanceCallbacks;
};

export const useUpdateInstanceName = ({
  projectId,
  instanceId,
  callbacks = {},
}: TUpdateInstanceNameArgs) => {
  const { onError, onSuccess } = callbacks;

  return useMutation({
    mutationFn: ({ instanceName }: TInstanceNameMutationFnVariables) =>
      updateInstanceName({ projectId, instanceId, instanceName }),
    onSuccess,
    onError,
  });
};

type TAttachNetworkMutationFnVariables = { networkId: string };

type TUseAttachNetworkCallbacks = DeepReadonly<{
  onSuccess?: (
    data: unknown,
    variables: TAttachNetworkMutationFnVariables,
  ) => void;
  onError?: (error: unknown) => void;
}>;

type TInstanceArgs = {
  projectId: string;
  instanceId: string;
  region: string;
};

const resetInstanceCache = ({ projectId, region, instanceId }: TInstanceArgs) =>
  queryClient.invalidateQueries({
    queryKey: instancesQueryKey(projectId, [
      'region',
      region,
      'instance',
      instanceId,
      'withBackups',
      'withImage',
      'withNetworks',
      'withVolumes',
    ]),
  });

export const useAttachNetwork = ({
  projectId,
  instanceId,
  region,
  callbacks = {},
}: TInstanceArgs & { callbacks: TUseAttachNetworkCallbacks }) => {
  const { onSuccess, onError } = callbacks;

  return useMutation({
    mutationFn: ({ networkId }: TAttachNetworkMutationFnVariables) =>
      attachNetwork({ projectId, instanceId, networkId }),
    onSuccess: (data, variables) => {
      void resetInstanceCache({ projectId, region, instanceId });

      onSuccess?.(data, variables);
    },
    onError,
  });
};

type TAttachVolumeMutationFnVariables = { volumeId: string };

type TUseAttachVolumeCallbacks = DeepReadonly<{
  onSuccess?: (
    data: unknown,
    variables: TAttachVolumeMutationFnVariables,
  ) => void;
  onError?: (error: unknown) => void;
}>;

export const useAttachVolume = ({
  projectId,
  instanceId,
  region,
  callbacks = {},
}: TInstanceArgs & { callbacks: TUseAttachVolumeCallbacks }) => {
  const { onSuccess, onError } = callbacks;

  return useMutation({
    mutationFn: ({ volumeId }: TAttachVolumeMutationFnVariables) =>
      attachVolume({ projectId, instanceId, volumeId }),
    onSuccess: (data, variables) => {
      void resetInstanceCache({ projectId, region, instanceId });

      onSuccess?.(data, variables);
    },
    onError,
  });
};

type TUpdateInstanceFromCacheArgs = {
  queryClient: QueryClient;
  projectId: string;
  instance: TPartialInstance;
  predicateQueryKey?: string[];
};

const instanceQueryKeyPredicate = (projectId: string, instanceId: string) => (
  query: Query,
) =>
  instancesQueryKey(projectId, [
    'region',
    'instance',
    instanceId,
  ]).every((elt) => query.queryKey.includes(elt));

export const updateInstanceFromCache = ({
  queryClient,
  projectId,
  instance,
}: TUpdateInstanceFromCacheArgs) => {
  const queries = queryClient.getQueriesData<TInstance[]>({
    predicate: instanceQueryKeyPredicate(projectId, instance.id),
  });

  queries.forEach(([queryKey]) =>
    queryClient.setQueryData<TInstance>(queryKey, (prevData) => {
      if (!prevData) return undefined;
      return { ...prevData, ...instance };
    }),
  );
};

export const getInstanceById = (
  projectId: string,
  instanceId: string,
  queryClient: QueryClient,
): TInstance | undefined => {
  const queries = queryClient.getQueriesData<TInstance[]>({
    predicate: instanceQueryKeyPredicate(projectId, instanceId),
  });

  return queries
    .flatMap(([, queryData]) => queryData)
    .find((instance) => instance?.id === instanceId);
};
