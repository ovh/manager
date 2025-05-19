import { useCallback } from 'react';
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { editInstanceName, getInstanceMock } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceDto } from '@/types/instance/api.type';
import { instancesQueryKey } from '@/utils';
import { DeepReadonly } from '@/types/utils.type';
import { instanceSelector } from './selectors/instances.selector';
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
  const projectUrl = useProjectUrl('public-cloud');

  return useQuery({
    queryKey: instancesQueryKey(projectId, ['instance', instanceId]),
    queryFn: () => getInstanceMock({ projectId, instanceId }),
    select: useCallback(
      (instanceDto: TInstanceDto) => instanceSelector(instanceDto, projectUrl),
      [projectUrl],
    ),
    ...queryOptions,
  });
};

export const updateInstanceFromCache = ({
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
