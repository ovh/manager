import { useParams } from 'react-router-dom';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { AddTokenProps, addToken } from '@/data/api/ai/token/token.api';

export interface AddRenewMutateTokenProps {
  onError: (cause: AIError) => void;
  onAddEditSuccess: (token: ai.token.Token) => void;
}

export function useAddToken({
  onError,
  onAddEditSuccess,
}: AddRenewMutateTokenProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (tokenInfo: AddTokenProps) => {
      return addToken(tokenInfo);
    },
    onError,
    onSuccess: (tokenInfo) => {
      queryClient.invalidateQueries({ queryKey: [projectId, 'ai', 'token'] });
      onAddEditSuccess(tokenInfo);
    },
  });

  return {
    addToken: (tokenInfo: AddTokenProps) => {
      return mutation.mutate(tokenInfo);
    },
    ...mutation,
  };
}
