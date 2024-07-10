import { useMutation } from '@tanstack/react-query';
import { TokenProps, renewToken } from '@/data/api/apiToken';
import { AddRenewMutateTokenProps } from './useAddToken';

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
