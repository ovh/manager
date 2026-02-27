import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { SERVICE_ACCOUNTS_TRACKING } from '@/tracking.constant';
import { useDeleteIamServiceAccount } from '@/data/hooks/useGetIamServiceAccounts';

export default function ServiceAccountsDelete() {
  const { t } = useTranslation(['service-accounts', 'permanent-tokens', NAMESPACES.ACTIONS]);
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const { clientId } = useParams();

  const { deleteServiceAccount, isPending } = useDeleteIamServiceAccount({
    clientId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: SERVICE_ACCOUNTS_TRACKING.DELETE.REQUEST_SUCCESS,
      });
      addSuccess(t('iam_service_accounts_delete_success'));
      goBack();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: SERVICE_ACCOUNTS_TRACKING.DELETE.REQUEST_FAIL,
      });
      addError(t('iam_service_accounts_delete_error'));
      goBack();
    },
  });

  const handleSubmit = () => {
    trackClick({
      actionType: 'action',
      actions: SERVICE_ACCOUNTS_TRACKING.DELETE.CTA_CONFIRM,
    });
    deleteServiceAccount();
  };

  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: SERVICE_ACCOUNTS_TRACKING.DELETE.CTA_CANCEL,
    });
    goBack();
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.critical}
      heading={t('iam_user_token_modal_title_delete', { tokenName: clientId, ns: 'permanent-tokens' })}
      primaryLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={handleSubmit}
      isPrimaryButtonDisabled={isPending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={handleCancel}
      onDismiss={handleCancel}
      isOpen
    >
      <OdsText>
        <Trans
          t={t}
          i18nKey="iam_user_token_modal_message_delete"
          values={{ tokenName: clientId }}
          ns="permanent-tokens"
        />
      </OdsText>
    </Modal>
  );
}
