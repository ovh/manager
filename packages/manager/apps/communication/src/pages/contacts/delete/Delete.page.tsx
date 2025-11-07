import { useParams, useNavigate } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import {
  useContactMean,
  useDeleteContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import { urls } from '@/routes/routes.constant';

export default function DeleteContactPage() {
  const { contactMeanId } = useParams();
  const navigate = useNavigate();
  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS]);
  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/contactMean/delete',
  ]);

  const { data: contactMean, isLoading: isLoadingContactMean } = useContactMean(
    {
      contactMeanId,
      enabled: !!contactMeanId && isAuthorized,
    },
  );

  const { mutate, isPending } = useDeleteContactMean({
    id: contactMeanId as string,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('delete_contact_success_message'));
      navigate(urls.ContactsTab);
    },
  });

  const onConfirm = () => {
    if (isPending) return;
    mutate();
  };

  usePendingRedirect({
    isLoading: isLoadingContactMean || isLoadingAuthorization,
    isAuthorized,
    condition: !!contactMeanId,
    redirectTo: urls.ContactsTab,
  });

  return (
    <Modal
      isOpen
      type={ODS_MODAL_COLOR.warning}
      heading={t('delete_contact_modal_title')}
      onDismiss={() => navigate(urls.ContactsTab)}
      onSecondaryButtonClick={() => navigate(urls.ContactsTab)}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      primaryLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={onConfirm}
      isPrimaryButtonLoading={isPending}
      isLoading={isPending}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
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
      </OdsText>
    </Modal>
  );
}
