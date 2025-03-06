import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { AIError } from '@/data/api';
import { postAuthorization } from '@/data/api/ai/authorization.api';

export interface PostMutateAuthorizationProps {
  onError: (cause: AIError) => void;
  onSuccess: (auth: ai.AuthorizationStatus) => void;
}

export function usePostAuthorization({
  onError,
  onSuccess,
}: PostMutateAuthorizationProps) {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return postAuthorization({ projectId });
    },
    onError,
    onSuccess: (data) => {
      // invalidate notebook auth
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai/authorization'],
        refetchType: 'none',
      });
      onSuccess(data);
    },
  });

  return {
    postAuthorization: () => {
      return mutation.mutate();
    },
    ...mutation,
  };
}
