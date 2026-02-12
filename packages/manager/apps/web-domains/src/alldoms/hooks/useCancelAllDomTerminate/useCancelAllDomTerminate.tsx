import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next'; import { useNavigate } from 'react-router-dom';
import { updateService } from '@/alldoms/data/api/web-domains';
import { ServiceInfoUpdateEnum } from '@/alldoms/enum/service.enum';
import {
  ServiceInfoRenewModeEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { TDomainsInfo } from '@/alldoms/types';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';
import { useCloseModal } from '@/common/hooks/closeModal/useCloseModal';
import { urls } from '@/alldoms/routes/routes.constant';

export const useCancelAllDomTerminate = (
  serviceName: string,
  domains: TDomainsInfo[],
) => {
  const { addError, addSuccess } = useNotifications();
  const { t } = useTranslation(['allDom']);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const closeUrl = useCloseModal(
    serviceName,
    `${urls.alldomsRoot}/${urls.alldomsListingCancelTerminate}`,
  );

  const { data: services } = useGetServices({
    names: domains.map((domain) => domain.name),
    serviceRoute: ServiceRoutes.Domain,
  });

  return useMutation({
    mutationFn: async () => {
      await updateService(
        serviceName,
        ServiceInfoUpdateEnum.Empty,
        ServiceRoutes.AllDom,
      );
      await Promise.all(
        services
          .filter(
            (domain) =>
              /* We filter on domains that have automatic renew mode because manual ones have to keep the terminateAtExpirationDate status */
              domain.billing.renew.current.mode ===
              ServiceInfoRenewModeEnum.Automatic,
          )
          .map((domain) =>
            updateService(
              domain.resource.name,
              ServiceInfoUpdateEnum.Empty,
              ServiceRoutes.Domain,
            ),
          ),
      );
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['allDom'],
      });
      addSuccess(
        t('allDom_cancel_terminate_success', {
          serviceName,
        }),
      );
    },

    onError: () => {
      addError(
        t('allDom_cancel_terminate_error', {
          serviceName,
        }),
      );
    },
    onSettled: () => navigate(closeUrl),
  });
};
