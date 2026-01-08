import { OkmsCredential } from '@key-management-service/types/okmsCredential.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';

import { DeleteOkmsCredentialParams, deleteOkmsCredential } from '../api/okmsCredential';
import { getOkmsCredentialsQueryKey } from './useOkmsCredential';

export type UseDeleteOkmsCredentialParams = {
  onSuccess: () => void;
  onError: () => void;
};

export const useDeleteOkmsCredential = ({ onSuccess, onError }: UseDeleteOkmsCredentialParams) => {
  const queryClient = useQueryClient();
  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/credential');

  return useMutation<OkmsCredential, ErrorResponse, DeleteOkmsCredentialParams>({
    mutationFn: deleteOkmsCredential,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsCredentialsQueryKey(variables.okmsId),
      });
      clearNotifications();
      addSuccess(t('key_management_service_credential_delete_success'), true);
      onSuccess();
    },
    onError,
  });
};
