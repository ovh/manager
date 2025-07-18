import React from 'react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { updateAllDomService } from '@/alldoms/data/api/web-domains';
import { ServiceInfoUpdateEnum } from '@/alldoms/enum/service.enum';

export default function ServiceCancelTerminate() {
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);
  const { serviceName } = useParams<{ serviceName: string }>();
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const useCancelAllDomTerminate = useMutation({
    mutationFn: () =>
      updateAllDomService(serviceName, ServiceInfoUpdateEnum.Empty),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['serviceInfo', serviceName],
      });
      addSuccess(
        t('allDom_cancel_terminate_success', {
          t0: serviceName,
        }),
      );
      navigate(-1);
    },

    onError: () => {
      navigate(-1);
      addError(
        t('allDom_cancel_terminate_error', {
          t0: serviceName,
        }),
      );
    },
  });

  return (
    <Modal
      heading={t(`allDom_cancel_terminate_title`, {
        t0: serviceName,
      })}
      type={ODS_MODAL_COLOR.information}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onPrimaryButtonClick={() => useCancelAllDomTerminate.mutate()}
      onSecondaryButtonClick={() => navigate(-1)}
    >
      <div className="mb-8">
        <OdsText>
          {t('allDom_cancel_terminate_subtitle', {
            t0: serviceName,
          })}
        </OdsText>
      </div>
    </Modal>
  );
}
