import { useMutation } from '@tanstack/react-query';
import { AIError, PCIAi } from '@/data/api';
import * as ai from '@/types/cloud/project/ai';
import { postAuthorization } from '@/data/api/ai/authorization.api';

export interface PostMutateAuthorizationProps {
  onError: (cause: AIError) => void;
  onSuccess: (auth: ai.AuthorizationStatus) => void;
}

export function usePostAuthorization({
  onError,
  onSuccess,
}: PostMutateAuthorizationProps) {
  const mutation = useMutation({
    mutationFn: (projectId: PCIAi) => {
      return postAuthorization(projectId);
    },
    onError,
    onSuccess,
  });

  return {
    postAuthorization: (projectId: PCIAi) => {
      return mutation.mutate(projectId);
    },
    ...mutation,
  };
}
