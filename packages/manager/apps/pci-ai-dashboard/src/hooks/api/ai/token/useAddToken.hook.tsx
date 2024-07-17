import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { AddTokenProps, addToken } from '@/data/api/ai/token.api';
import { ai } from '@/types/ai';

export interface AddRenewMutateTokenProps {
  onError: (cause: AIError) => void;
  onSuccess: (token: ai.token.Token) => void;
}

export function useAddToken({ onError, onSuccess }: AddRenewMutateTokenProps) {
  const mutation = useMutation({
    mutationFn: (tokenInfo: AddTokenProps) => {
      return addToken(tokenInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addToken: (tokenInfo: AddTokenProps) => {
      return mutation.mutate(tokenInfo);
    },
    ...mutation,
  };
}
