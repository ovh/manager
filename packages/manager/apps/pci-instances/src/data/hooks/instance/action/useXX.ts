import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getInstanceById } from '../useInstances';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useInstance } from '../useInstance';

export const useXX = (instanceId: string) => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  const cachedInstance = useMemo(
    () => getInstanceById(projectId, instanceId, queryClient),
    [instanceId, projectId, queryClient],
  );

  const { data, isFetching, isError, isFetched } = useInstance(instanceId, {
    enabled: !cachedInstance,
  });

  return {
    instance: cachedInstance ?? data,
    isFetching,
    isError,
    isFetched,
  };
};
