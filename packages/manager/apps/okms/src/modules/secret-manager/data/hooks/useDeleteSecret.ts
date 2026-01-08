import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';

import { DeleteSecretParams, deleteSecret, secretQueryKeys } from '../api/secrets';

export const useDeleteSecret = () => {
  const { t } = useTranslation('secret-manager');
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();

  return useMutation<void, ErrorResponse, DeleteSecretParams>({
    mutationFn: deleteSecret,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(variables.okmsId),
      });
      addSuccess(t('delete_secret_success'), true);
    },
  });
};
