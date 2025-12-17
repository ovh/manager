import { useParams, useNavigate } from 'react-router-dom';
import { Modal, MODAL_COLOR, useNotifications } from '@ovh-ux/muk';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useDeleteRouting } from '@/data/hooks/useNotificationRouting/useNotificationRouting';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import { urls } from '@/routes/routes.constant';
import { useNotificationRouting } from '@/data';
import { TrackingSubApps } from '@/tracking.constant';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { ModalOpenChangeDetail, Text, TEXT_PRESET } from '@ovhcloud/ods-react';

export default function DeleteContactPage() {
  const { routingId } = useParams();
  const navigate = useNavigate();
  const { addSuccess, clearNotifications, addError } = useNotifications();
  const { t } = useTranslation(['settings', NAMESPACES.ACTIONS]);
  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/routing/delete',
  ]);
  const { trackClick, trackErrorBanner, trackInfoBanner } = useTracking();

  const trackButtonClick = (actions: string[]) =>
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions,
      subApp: TrackingSubApps.Settings,
    });

  const { mutate, isPending } = useDeleteRouting({
    routingId: routingId as string,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('delete_routing_success_message'));
      trackInfoBanner({
        pageName: `delete_rule_success_${t('delete_routing_success_message')}`,
        subApp: TrackingSubApps.Settings,
      });
      navigate(urls.routing.listing);
    },
    onError: () => {
      clearNotifications();
      addError(t('delete_routing_error_message'));
      trackErrorBanner({
        pageName: `delete_rule_error_${t('delete_routing_error_message')}`,
        subApp: TrackingSubApps.Settings,
      });
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
    trackButtonClick(['delete_rule', 'confirm']);
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
      open
      type={MODAL_COLOR.warning}
      heading={t('delete_routing_modal_title')}
      onOpenChange={(detail?: ModalOpenChangeDetail) => console.log(detail)}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        onClick: onConfirm,
        loading: isPending,
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: () => navigate(urls.routing.listing),
      }}
      loading={isPending}
      dismissible={true}
    >
      <Text preset={TEXT_PRESET.paragraph}>
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
      </Text>
    </Modal>
  );
}
