import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  associateVrack,
  createVrack,
  getProjectVrack,
  getVracks,
  pollOperation,
  pollVrackTask,
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

export interface VrackActionProps {
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useCreateVrack = ({ onError, onSuccess }: VrackActionProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { id } = await createVrack(projectId);
      return pollOperation(projectId, id);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [VRACK_QUERY_KEY],
      });
      await queryClient.invalidateQueries({
        queryKey: [PROJECT_VRACK_QUERY_KEY],
      });
      onSuccess();
    },
  });
  return {
    createVrack: (projectId: string) => mutation.mutate(projectId),
    ...mutation,
  };
};

export const useAssociateVrack = ({ onError, onSuccess }: VrackActionProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      vrack,
      projectId,
    }: {
      vrack: string;
      projectId: string;
    }) => {
      const { id: taskId } = await associateVrack(vrack, projectId);
      return pollVrackTask(vrack, taskId);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [VRACK_QUERY_KEY],
      });
      await queryClient.invalidateQueries({
        queryKey: [PROJECT_VRACK_QUERY_KEY],
      });
      onSuccess();
    },
  });
  return {
    associateVrack: (vrack: string, projectId: string) =>
      mutation.mutate({ vrack, projectId }),
    ...mutation,
  };
};
