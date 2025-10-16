import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { updateService } from '@/alldoms/data/api/web-domains';
import {
  ServiceInfoRenewMode,
  ServiceInfoUpdateEnum,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';
import { TDomainsInfo } from '@/alldoms/types';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';
import { useCloseModal } from '@/common/hooks/closeModal/useCloseModal';

export const useCancelAllDomTerminate = (
  serviceName: string,
  domains: TDomainsInfo[],
) => {
  const { addError, addSuccess } = useNotifications();
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);
  const queryClient = useQueryClient();
  const closeModal = useCloseModal();

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
              ServiceInfoRenewMode.Automatic,
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
    onSettled: () => {
      closeModal();
    },
  });
};
