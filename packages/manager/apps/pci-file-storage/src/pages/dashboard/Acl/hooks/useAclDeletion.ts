import { useCallback } from 'react';

import { useDeleteAcl } from '@/data/hooks/acl/useDeleteAcl';
import { isApiErrorResponse } from '@/data/utils';
import { useProjectId } from '@/hooks/useProjectId';
import { useShareParams } from '@/hooks/useShareParams';
import { ToastDuration, errorToast, successToast } from '@/utils/toast.utils';

export const useAclDeletion = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
} = {}) => {
  const projectId = useProjectId();
  const { region, shareId } = useShareParams();

  const handleSuccess = useCallback(() => {
    successToast({
      duration: ToastDuration.Short,
      ns: 'acl',
      i18nKey: 'acl:columns.actions.delete.success',
    });
    onSuccess?.();
  }, [onSuccess]);

  const handleError = useCallback(
    (error: Error) => {
      const errorMessage = isApiErrorResponse(error) ? error.response?.data.message : error.message;
      errorToast({
        duration: ToastDuration.Infinite,
        ns: 'acl',
        i18nKey: 'acl:columns.actions.delete.error',
        values: { errorMessage },
      });
      onError?.(errorMessage);
    },
    [onError],
  );

  const { mutate: deleteAcl, isPending } = useDeleteAcl(projectId, region, shareId, {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return {
    deleteAcl,
    isPending,
  };
};
