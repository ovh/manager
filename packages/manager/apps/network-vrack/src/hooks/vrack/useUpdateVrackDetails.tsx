import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/muk';

import { getVrackDetailQueryKey } from '@/data/api/get/vrackDetails';
import { VrackUpdate, putVrackDetail } from '@/data/api/put/vrack-details';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export const useUpdateVrackDetails = (serviceName: string) => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.common]);

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
