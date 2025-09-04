import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ErrorResponse } from '@/types/api.type';
import {
  deleteSecret,
  DeleteSecretParams,
  secretQueryKeys,
} from '../api/secrets';

export const useDeleteSecret = () => {
  const { t } = useTranslation('secret-manager');
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();

  return useMutation<null, ErrorResponse, DeleteSecretParams>({
    mutationFn: deleteSecret,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(variables.okmsId),
      });
      addSuccess(t('delete_secret_success'), true);
    },
  });
};
