import { useCallback } from 'react';

import { useDeleteShare } from '@/data/hooks/shares/useDeleteShare';
import { isApiErrorResponse } from '@/data/utils';

export type TUseShareDeletionCallbacks = {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
};

export const useShareDeletion = (
  projectId: string,
  region: string,
  shareId: string,
  { onSuccess, onError }: TUseShareDeletionCallbacks,
) => {
  const handleError = useCallback(
    (error: Error) => {
      const errorMessage =
        (isApiErrorResponse(error) ? error.response?.data.message : error.message) ?? '';
      onError?.(errorMessage);
    },
    [onError],
  );

  const { mutate: deleteShare, isPending } = useDeleteShare(projectId, region, shareId, {
    onSuccess,
    onError: handleError,
  });

  return { deleteShare, isPending };
};
