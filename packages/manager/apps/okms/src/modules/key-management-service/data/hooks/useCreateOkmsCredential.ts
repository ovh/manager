import {
  OkmsCredential,
  OkmsCredentialCreation,
} from '@key-management-service/types/okmsCredential.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { createOkmsCredential } from '../api/okmsCredential';
import { getOkmsCredentialsQueryKey } from './useOkmsCredential';

export type CreateOkmsCredentialParams = {
  okmsId: string;
  onSuccess: (credential: OkmsCredential) => void;
  onError: () => void;
};

export const useCreateOkmsCredential = ({
  okmsId,
  onSuccess,
  onError,
}: CreateOkmsCredentialParams) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess, clearNotifications } = useNotifications();

  const { t } = useTranslation('key-management-service/credential');

  const { mutate: createKmsCredential, isPending } = useMutation({
    mutationFn: async (data: OkmsCredentialCreation) => {
      const okmsCredential = await createOkmsCredential({ okmsId, data });
      return okmsCredential;
    },
    onSuccess: async (credential: OkmsCredential) => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsCredentialsQueryKey(okmsId),
      });
      clearNotifications();
      addSuccess(t('key_management_service_credential_create_success'), true);
      onSuccess?.(credential);
    },
    onError: (result: ApiError) => {
      clearNotifications();
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
