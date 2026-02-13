import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';

import { secretVersionsQueryKeys } from '../api/secretVersions';
import { DeleteSecretParams, deleteSecret, secretQueryKeys } from '../api/secrets';

export const useDeleteSecret = () => {
  const { t } = useTranslation('secret-manager');
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();

  return useMutation<void, ErrorResponse, DeleteSecretParams>({
    mutationFn: deleteSecret,
    onSuccess: async (_, variables) => {
      const { okmsId, secretPath } = variables;

      // Remove deleted secret's queries to avoid 404 refetches when invalidating the list.
      // invalidateQueries(list) would otherwise refetch detail/detailWithData/versions.
      queryClient.removeQueries({
        queryKey: secretQueryKeys.detail(okmsId, secretPath),
      });
      queryClient.removeQueries({
        queryKey: secretQueryKeys.detailWithData(okmsId, secretPath),
      });
      queryClient.removeQueries({
        queryKey: secretVersionsQueryKeys.list(okmsId, secretPath),
      });

      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(okmsId),
      });
      addSuccess(t('delete_secret_success'), true);
    },
  });
};
