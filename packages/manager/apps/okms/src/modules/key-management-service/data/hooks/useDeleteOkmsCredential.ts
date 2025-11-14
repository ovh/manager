import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteOkmsCredential,
  deleteOkmsCredentialQueryKey,
} from '../api/okmsCredential';
import { getOkmsCredentialsQueryKey } from './useOkmsCredential';

export interface IUseDeleteOkmsCredential {
  okmsId: string;
  credentialId: string;
  onSuccess: () => void;
  onError: () => void;
}

export const useDeleteOkmsCredential = ({
  okmsId,
  credentialId,
  onSuccess,
  onError,
}: IUseDeleteOkmsCredential) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/credential');

  const { mutate, isPending } = useMutation({
    mutationKey: deleteOkmsCredentialQueryKey({ okmsId, credentialId }),
    mutationFn: async () => {
      return deleteOkmsCredential({ okmsId, credentialId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsCredentialsQueryKey(okmsId),
      });
      clearNotifications();
      addSuccess(t('key_management_service_credential_delete_success'), true);
      onSuccess();
    },
    onError: (result: ApiError) => {
      clearNotifications();
      addError(
        t('key_management_service_credential_delete_error', {
          error: result.message,
        }),
        true,
      );
      onError();
    },
  });

  return {
    mutate,
    isPending,
  };
};
