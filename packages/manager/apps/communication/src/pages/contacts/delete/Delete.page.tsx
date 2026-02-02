import { useParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Modal, MODAL_COLOR } from '@ovh-ux/muk';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ModalOpenChangeDetail, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import {
  ButtonType,
  PageLocation,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import {
  useContactMean,
  useDeleteContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import { urls } from '@/routes/routes.constant';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

export default function DeleteContactPage() {
  const { contactMeanId } = useParams();
  const navigate = useNavigate();
  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS]);
  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/contactMean/delete',
  ]);
  const { trackPage, trackClick } = useTracking();

  const { data: contactMean, isLoading: isLoadingContactMean } = useContactMean(
    {
      contactMeanId,
      enabled: !!contactMeanId && isAuthorized,
    },
  );

  const { mutate, isPending } = useDeleteContactMean({
    id: contactMeanId as string,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_contact_success',
        subApp: TrackingSubApps.Contacts,
      });
      clearNotifications();
      addSuccess(t('delete_contact_success_message'));
      navigate(urls.contact.listing);
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'delete_contact_error',
        subApp: TrackingSubApps.Contacts,
      });
    },
  });

  const onConfirm = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['delete_contact', 'confirm'],
      subApp: TrackingSubApps.Contacts,
    });
    if (isPending) return;
    mutate();
  };

  usePendingRedirect({
    isLoading: isLoadingContactMean || isLoadingAuthorization,
    isAuthorized,
    condition: !!contactMeanId,
    redirectTo: urls.contact.listing,
  });

  return (
    <Modal
      open
      type={MODAL_COLOR.warning}
      heading={t('delete_contact_modal_title')}
      onOpenChange={(detail?: ModalOpenChangeDetail) => (detail?.open === false) && navigate(urls.contact.listing)}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        onClick: onConfirm,
        loading: isPending,
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['delete_contact', 'cancel'],
            subApp: TrackingSubApps.Contacts,
          });
          navigate(urls.contact.listing);
        },
      }}
      loading={isPending}
    >
      <Text preset={TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey="delete_contact_modal_info"
          components={{
            strong: <strong />,
          }}
          values={{
            contactName: contactMean?.description,
          }}
        />
      </Text>
    </Modal>
  );
}
