import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OkmsCredentialCreation } from '@/types/okmsCredential.type';
import { createOkmsCredential } from '../api/okmsCredential';
import { getOkmsCredentialsQueryKey } from './useOkmsCredential';

export type CreateOkmsCredentialParams = {
  okmsId: string;
  onSuccess: () => void;
  onError: () => void;
};

export const useCreateOkmsCredential = ({
  okmsId,
  onSuccess,
  onError,
}: CreateOkmsCredentialParams) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess } = useNotifications();

  const { t } = useTranslation('key-management-service/credential');

  const { mutate: createKmsCredential, isPending } = useMutation({
    mutationFn: (data: OkmsCredentialCreation) => {
      return createOkmsCredential({ okmsId, data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsCredentialsQueryKey(okmsId),
      });
      addSuccess(t('key_management_service_credential_create_success'), true);
      onSuccess?.();
    },
    onError: (result: ApiError) => {
      addError(
        t('key_management_service_credential_create_error', {
          error: result.message,
        }),
        true,
      );
      onError?.();
    },
  });

  return {
    createKmsCredential,
    isPending,
  };
};
