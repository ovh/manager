import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  associateVrack,
  createVrack,
  getProjectVrack,
  getVracks,
  getVrackTask,
  TVrackTask,
  VrackTaskStatus,
} from '@/api/data/vrack';

export const VRACK_QUERY_KEY = 'vrack';
export const PROJECT_VRACK_QUERY_KEY = 'project-vrack';

export const useProjectVrack = (projectId: string) =>
  useQuery({
    queryKey: [PROJECT_VRACK_QUERY_KEY],
    queryFn: async () => getProjectVrack(projectId),
    retry: false,
    throwOnError: false,
  });

export const useVracks = () =>
  useQuery({
    queryKey: [VRACK_QUERY_KEY],
    queryFn: () => getVracks(),
    select: (data) =>
      data?.map((vrack) => {
        const vrackId = (vrack.iam?.urn?.match(/vrack:(.*)$/) || [])[1];
        return {
          vrackId,
          displayName: vrack.name || vrack.iam?.displayName || vrackId,
          ...vrack,
        };
      }),
  });

export const useCreateVrack = ({
  onError,
  onSuccess,
}: {
  onError: (cause: Error) => void;
  onSuccess: (operationId: string) => void;
}) => {
  const mutation = useMutation({
    mutationFn: createVrack,
    onError,
    onSuccess: async ({ id }) => {
      onSuccess(id);
    },
  });
  return {
    createVrack: (projectId: string) => mutation.mutate(projectId),
    ...mutation,
  };
};

export const useAssociateVrack = ({
  projectId,
  vrackId,
  onError,
  onSuccess,
}: {
  projectId: string;
  vrackId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const [taskId, setTaskId] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsPending(true);
      const { id } = await associateVrack(vrackId, projectId);
      return id;
    },
    onError,
    onSuccess: setTaskId,
  });

  // polling of task association
  const { data: task, error } = useQuery<TVrackTask>({
    queryKey: ['pci-vrack-task', vrackId, taskId],
    queryFn: () => getVrackTask(vrackId, taskId),
    enabled: (query) =>
      !!projectId &&
      !!taskId &&
      ![VrackTaskStatus.Cancelled, VrackTaskStatus.Done].includes(
        query.state.data?.status,
      ),
    refetchInterval: 3000,
    retry: 5,
  });

  // report an error if failling task polling after retries
  useEffect(() => {
    if (error && isPending) {
      setIsPending(false);
      onError(error);
    }
  }, [error, isPending]);

  // report after polling
  useEffect(() => {
    if (!isPending) return;
    // if task is missing (404) it is assumed to be done
    if (task === null || task?.status === VrackTaskStatus.Done) {
      queryClient.invalidateQueries({
        queryKey: [VRACK_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [PROJECT_VRACK_QUERY_KEY],
      });
      setIsPending(false);
      onSuccess();
    } else if (task?.status === VrackTaskStatus.Cancelled) {
      setIsPending(false);
      onError(new Error(task.status));
    }
  }, [task, isPending]);

  return {
    associateVrack: mutation.mutate,
    isPending,
  };
};
