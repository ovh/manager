import { Modal } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SUPPORT_URL } from '@/constants';

export default function IncreaseQuota() {
  const { t } = useTranslation('increase-quota');

  const navigate = useNavigate();

  const handleClose = () => navigate('..');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const handleContactSupport = () => {
    window.open(`${SUPPORT_URL}${ovhSubsidiary}`, '_blank');
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.critical}
      primaryLabel={t('pci_project_new_error_contact_support')}
      onPrimaryButtonClick={handleContactSupport}
      secondaryLabel={t('pci_project_new_error_cancel')}
      onSecondaryButtonClick={handleClose}
      onDismiss={handleClose}
      isOpen={true}
    >
      <OdsText>
        {t('pci_project_new_error_ask_increase_projects_quota')}
      </OdsText>
    </Modal>
  );
}
