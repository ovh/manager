import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { TokenProps, deleteToken } from '@/data/api/apiToken';

interface DeleteMutateTokenProps {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useDeleteToken({ onError, onSuccess }: DeleteMutateTokenProps) {
  const mutation = useMutation({
    mutationFn: (tokenId: TokenProps) => {
      return deleteToken(tokenId);
    },
    onError,
    onSuccess,
  });

  return {
    deleteToken: (tokenId: TokenProps) => {
      return mutation.mutate(tokenId);
    },
    ...mutation,
  };
}
