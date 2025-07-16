import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate } from 'react-router-dom';
import { updateService } from '@/alldoms/data/api/web-domains';
import {
  ServiceInfoUpdateEnum,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';

export const useTerminateService = (serviceName: string, domains: string[]) => {
  const { addError, addSuccess } = useNotifications();
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await updateService(
        serviceName,
        ServiceInfoUpdateEnum.TerminateAtExpirationDate,
        ServiceRoutes.AllDom,
      );
      await Promise.all(
        domains.map((domain) =>
          updateService(
            domain,
            ServiceInfoUpdateEnum.TerminateAtExpirationDate,
            ServiceRoutes.Domain,
          ),
        ),
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDom'] });
      addSuccess(t('allDom_modal_success_message'));
    },
    onError: (error) => {
      addError(
        t('allDom_modal_error_message', {
          message: error.message,
        }),
      );
    },
    onSettled: () => {
      navigate(-1);
    },
  });
};
