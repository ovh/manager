import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/muk';

import { getVrackDetailQueryKey } from '@/data/api/get/vrack-details';
import { VrackUpdate, putVrackDetail } from '@/data/api/put/vrack-details';

export const useUpdateVrackDetails = (serviceName: string) => {
  const { t } = useTranslation(['common']);

  const queryClient = useQueryClient();
  const { addError } = useNotifications();

  return useMutation({
    mutationFn: (vrackDetails: VrackUpdate) => putVrackDetail(serviceName, vrackDetails),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVrackDetailQueryKey(serviceName),
      });
    },
    onError: (e) => {
      addError(t('common_error', { error: e.message }));
    },
  });
};
