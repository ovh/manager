import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';

export default function ResetTenantPasswordPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');

  return (
    <Modal
      isOpen
      heading={t('vspc_reset_password')}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:close`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.information}
    >
      <section className="flex flex-col gap-4 whitespace-pre-line">
        <OdsMessage isDismissible={false}>
          {t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:vspc_reset_password_forgotten`)}
        </OdsMessage>
        <OdsMessage isDismissible={false}>
          {t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:vspc_reset_password_logged_in`)}
        </OdsMessage>
      </section>
    </Modal>
  );
}
