import { useCallback } from 'react';

import { CreateShareCommand, useCreateShare } from '@/data/hooks/shares/useCreateShare';
import { isApiErrorResponse } from '@/data/utils';

export type TUseShareCreationCallbacks = {
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
};

export const useShareCreation = (
  projectId: string,
  { onSuccess, onError }: TUseShareCreationCallbacks,
) => {
  const handleError = useCallback(
    (error: Error) => {
      const errorMessage =
        (isApiErrorResponse(error) ? error.response?.data.message : error.message) ?? '';

      onError?.(errorMessage);
    },
    [onError],
  );

  const { mutate: createShare, isPending } = useCreateShare({
    projectId,
    onSuccess,
    onError: handleError,
  });

  return { createShare, isPending };
};

export type { CreateShareCommand };
