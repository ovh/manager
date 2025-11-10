import { useParams, useNavigate } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useDeleteRouting } from '@/data/hooks/useNotificationRouting/useNotificationRouting';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import { urls } from '@/routes/routes.constant';
import { useNotificationRouting } from '@/data';

export default function DeleteContactPage() {
  const { routingId } = useParams();
  const navigate = useNavigate();
  const { addSuccess, clearNotifications, addError } = useNotifications();
  const { t } = useTranslation(['settings', NAMESPACES.ACTIONS]);
  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/routing/delete',
  ]);

  const { mutate, isPending } = useDeleteRouting({
    routingId: routingId as string,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('delete_routing_success_message'));
      navigate(urls.routing.listing);
    },
    onError: () => {
      clearNotifications();
      addError(t('delete_routing_error_message'));
      navigate(urls.routing.listing);
    },
  });

  const { data: routing, isLoading: isLoadingRouting } = useNotificationRouting(
    {
      routingId,
      enabled: isAuthorized,
    },
  );

  const onConfirm = () => {
    if (isPending) return;
    mutate();
  };

  usePendingRedirect({
    isLoading: isLoadingRouting || isLoadingAuthorization,
    isAuthorized,
    condition: !!routingId,
    redirectTo: urls.routing.listing,
  });

  return (
    <Modal
      isOpen
      type={ODS_MODAL_COLOR.warning}
      heading={t('delete_routing_modal_title')}
      onDismiss={() => navigate(urls.routing.listing)}
      onSecondaryButtonClick={() => navigate(urls.routing.listing)}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      primaryLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={onConfirm}
      isPrimaryButtonLoading={isPending}
      isLoading={isPending}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey="delete_routing_modal_info"
          components={{
            strong: <strong />,
          }}
          values={{
            routingName: routing?.name,
          }}
        />
      </OdsText>
    </Modal>
  );
}
