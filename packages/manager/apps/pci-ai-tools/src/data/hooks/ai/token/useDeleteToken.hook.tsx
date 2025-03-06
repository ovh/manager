import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { TokenProps, deleteToken } from '@/data/api/ai/token/token.api';

interface DeleteMutateTokenProps {
  onError: (cause: AIError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteToken({
  onError,
  onDeleteSuccess,
}: DeleteMutateTokenProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (tokenId: TokenProps) => {
      return deleteToken(tokenId);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [projectId, 'ai', 'token'] });
      onDeleteSuccess();
    },
  });

  return {
    deleteToken: (tokenId: TokenProps) => {
      return mutation.mutate(tokenId);
    },
    ...mutation,
  };
}
