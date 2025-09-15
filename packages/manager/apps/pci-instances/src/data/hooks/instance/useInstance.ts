import {
  useQuery,
  UseQueryOptions,
  useMutation,
  useQueryClient,
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
import { TInstance } from '@/types/instance/entity.type';
import { DeepReadonly } from '@/types/utils.type';
import { resetInstanceCache } from '@/adapters/tanstack-query/store/instances/updaters';

export type TUseInstanceQueryOptions = Pick<
  UseQueryOptions<TInstance>,
  'enabled' | 'retry' | 'gcTime' | 'refetchOnWindowFocus'
>;

type TUseInstanceArgs = DeepReadonly<{
  region: string | null;
  instanceId: string;
  params?: TGetInstanceQueryParams;
  queryOptions?: TUseInstanceQueryOptions;
}>;

const getPendingTasks = (data?: TInstance) =>
  data?.task.isPending
    ? [{ instanceId: data.id, region: data.region.name }]
    : [];

export const useInstance = ({
  region,
  instanceId,
  params,
  queryOptions,
}: TUseInstanceArgs) => {
  const projectId = useProjectId();

  const { data, ...query } = useQuery({
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

  return {
    data,
    pendingTasks: getPendingTasks(data),
    ...query,
  };
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

export const useAttachNetwork = ({
  projectId,
  instanceId,
  region,
  callbacks = {},
}: TInstanceArgs & { callbacks: TUseAttachNetworkCallbacks }) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = callbacks;

  return useMutation({
    mutationFn: ({ networkId }: TAttachNetworkMutationFnVariables) =>
      attachNetwork({ projectId, instanceId, networkId }),
    onSuccess: (data, variables) => {
      void resetInstanceCache(queryClient, { projectId, region, instanceId });

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
  callbacks = {},
}: {
  projectId: string;
  instanceId: string;
  callbacks: TUseAttachVolumeCallbacks;
}) => {
  const { onSuccess, onError } = callbacks;

  return useMutation({
    mutationFn: ({ volumeId }: TAttachVolumeMutationFnVariables) =>
      attachVolume({ projectId, instanceId, volumeId }),
    onSuccess,
    onError,
  });
};
