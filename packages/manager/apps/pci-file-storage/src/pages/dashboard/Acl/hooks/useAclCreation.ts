import { useCallback } from 'react';

import { useCreateAcl } from '@/data/hooks/acl/useCreateAcl';
import { CreateAclCommand } from '@/data/hooks/acl/useCreateAcl';
import { isApiErrorResponse } from '@/data/utils';
import { useProjectId } from '@/hooks/useProjectId';
import { useShareParams } from '@/hooks/useShareParams';
import { ToastDuration, errorToast, successToast } from '@/utils/toast.utils';

export const useAclCreation = ({
  onSuccess,
  onError,
}: { onSuccess?: () => void; onError?: (errorMessage: string) => void } = {}) => {
  const projectId = useProjectId();
  const { region, shareId } = useShareParams();

  const handleSuccess = useCallback(() => {
    successToast({ duration: ToastDuration.Short, ns: 'acl', i18nKey: 'acl:add.success' });
    onSuccess?.();
  }, [onSuccess]);

  const handleError = useCallback(
    (error: Error) => {
      const errorMessage = isApiErrorResponse(error) ? error.response.data.message : error.message;
      errorToast({
        duration: ToastDuration.Infinite,
        ns: 'acl',
        i18nKey: 'acl:add.error',
        values: { errorMessage },
      });
      onError?.(errorMessage);
    },
    [onError],
  );

  const { mutate: createAcl, isPending } = useCreateAcl(projectId, region, shareId, {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return { createAcl, isPending };
};

export type { CreateAclCommand };
