import { useMutation } from '@tanstack/react-query';
import { TokenProps, renewToken } from '@/data/api/ai/token.api';
import { AddRenewMutateTokenProps } from './useAddToken.hook';

export function useRenewToken({
  onError,
  onSuccess,
}: AddRenewMutateTokenProps) {
  const mutation = useMutation({
    mutationFn: (tokenId: TokenProps) => {
      return renewToken(tokenId);
    },
    onError,
    onSuccess,
  });

  return {
    renewToken: (tokenId: TokenProps) => {
      return mutation.mutate(tokenId);
    },
    ...mutation,
  };
}
