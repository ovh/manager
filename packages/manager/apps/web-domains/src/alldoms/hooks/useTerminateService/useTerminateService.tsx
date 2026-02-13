import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { updateService } from '@/alldoms/data/api/web-domains';
import { ServiceInfoUpdateEnum } from '@/alldoms/enum/service.enum';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { useCloseModal } from '@/common/hooks/closeModal/useCloseModal';
import { urls } from '@/alldoms/routes/routes.constant';

export const useTerminateService = (serviceName: string, domains: string[]) => {
  const { addError, addSuccess } = useNotifications();
  const { t } = useTranslation(['allDom']);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const closeUrl = useCloseModal(
    serviceName,
    `${urls.alldomsRoot}/${urls.alldomsListingTerminate}`,
  );

  return useMutation({
    mutationFn: async () => {
      await updateService(
        serviceName,
        ServiceInfoUpdateEnum.TerminateAtExpirationDate,
        ServiceRoutes.AllDom,
      );
      if (domains) {
        await Promise.all(
          domains.map((domain) =>
            updateService(
              domain,
              ServiceInfoUpdateEnum.TerminateAtExpirationDate,
              ServiceRoutes.Domain,
            ),
          ),
        );
      }
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
    onSettled: () => navigate(closeUrl),
  });
};
