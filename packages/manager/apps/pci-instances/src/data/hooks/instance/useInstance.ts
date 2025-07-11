import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query';
import {
  attachNetwork,
  getInstance,
  TGetInstanceQueryParams,
  updateInstanceName,
} from '@/data/api/instance';
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

type TUseAttachNetworkCallbacks = DeepReadonly<{
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}>;

type TUseAttachNetworkArgs = {
  projectId: string;
  instanceId: string;
  networkId: string;
  callbacks: TUseAttachNetworkCallbacks;
};

export const useAttachNetwork = ({
  projectId,
  instanceId,
  networkId,
  callbacks = {},
}: TUseAttachNetworkArgs) => {
  const { onSuccess, onError } = callbacks;

  return useMutation({
    mutationFn: () => attachNetwork({ projectId, instanceId, networkId }),
    onSuccess,
    onError,
  });
};
