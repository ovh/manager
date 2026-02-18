import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { toast } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useCreateAcl } from '@/data/hooks/acl/useCreateAcl';
import { CreateAclCommand } from '@/data/hooks/acl/useCreateAcl';
import { isApiErrorResponse } from '@/data/utils';
import { useProjectId } from '@/hooks/useProjectId';
import { useShareParams } from '@/hooks/useShareParams';

export const useAclCreation = ({
  onSuccess,
  onError,
}: { onSuccess?: () => void; onError?: (errorMessage: string) => void } = {}) => {
  const { t } = useTranslation(['acl', NAMESPACES.ACTIONS]);
  const projectId = useProjectId();
  const { region, shareId } = useShareParams();

  const handleSuccess = useCallback(() => {
    toast(t('acl:add.success'), { color: 'success' });
    onSuccess?.();
  }, [t, onSuccess]);

  const handleError = useCallback(
    (error: Error) => {
      const errorMessage = isApiErrorResponse(error) ? error.response.data.message : error.message;
      toast(t('acl:add.error', { errorMessage }), { color: 'critical' });
      onError?.(errorMessage);
    },
    [t, onError],
  );

  const { mutate: createAcl, isPending } = useCreateAcl(projectId, region, shareId, {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return { createAcl, isPending };
};

export type { CreateAclCommand };
