import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shareDetailsQueryKey, sharesQueryKey } from '@/adapters/shares/queryKeys';
import { deleteShare } from '@/data/api/shares.api';

export type TUseDeleteShareOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteShare = (
  projectId: string,
  region: string,
  shareId: string,
  options?: TUseDeleteShareOptions,
) => {
  const queryClient = useQueryClient();
  const { onSuccess: onSuccessOption, onError } = options ?? {};

  return useMutation({
    mutationFn: () => deleteShare(projectId, region, shareId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sharesQueryKey(projectId) });
      void queryClient.invalidateQueries({
        queryKey: shareDetailsQueryKey(projectId, region, shareId),
      });
      onSuccessOption?.();
    },
    onError,
  });
};
