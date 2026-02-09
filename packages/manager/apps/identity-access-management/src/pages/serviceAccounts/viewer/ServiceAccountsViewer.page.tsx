import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Modal } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsClipboard,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { SERVICE_ACCOUNTS_TRACKING } from '@/tracking.constant';
import ServiceAccountContext from '@/contexts/service-account-secret.context';

export default function ServiceAccountsViewer() {
  const { t } = useTranslation(['service-accounts', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const { secret } = useContext(ServiceAccountContext);

  const handleClose = () => {
    trackClick({
      actionType: 'action',
      actions: SERVICE_ACCOUNTS_TRACKING.VIEWER.CTA_CLOSE,
    });
    goBack();
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      heading={t('iam_service_accounts_your_service_account_created')}
      secondaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={handleClose}
      isOpen
    >
      <OdsFormField className="mb-6 mt-6">
        <label htmlFor="serviceAccountClientIdClipboard" slot="label">
          {t('iam_service_accounts_service_account_name')}
        </label>
        <OdsClipboard
          className="w-full"
          name="serviceAccountClientIdClipboard"
          value={secret.clientId}
          data-testid="serviceAccountClientIdClipboard"
        />
      </OdsFormField>
      <OdsFormField className="mb-6 mt-6">
        <label htmlFor="serviceAccountClientSecretClipboard" slot="label">
          {t('iam_service_accounts_service_password')}
        </label>
        <OdsClipboard
          className="w-full"
          name="serviceAccountClientSecretClipboard"
          value={secret.clientSecret}
          data-testid="serviceAccountClientSecretClipboard"
        />
      </OdsFormField>
      <OdsMessage color={ODS_MODAL_COLOR.warning} isDismissible={false}>
        {t('iam_service_accounts_warning_content')}
      </OdsMessage>
    </Modal>
  );
}
