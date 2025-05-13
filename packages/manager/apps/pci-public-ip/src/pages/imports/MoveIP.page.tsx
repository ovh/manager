import { useNavigate, useParams } from 'react-router-dom';

import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

import { PciModal } from '@ovh-ux/manager-pci-common';
import { useMoveIP } from '@/api/hooks/useImportIP';

export default function MoveIPPage() {
  const { t } = useTranslation('imports');
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { projectId } = useParams();

  const { ip } = useParams();
  const ipToMove = ip.replace('~2F', '%2F');

  const handleModalClose = () => navigate('..');

  const handleMoveIPSuccess = () => {
    addSuccess(
      t('pci_additional_ips_imports_import_success', {
        ip: decodeURIComponent(ipToMove),
        interpolation: {
          escapeValue: false,
        },
      }),
    );

    navigate('../../floating-ips');
  };

  const handleMoveIPError = (error: Error) => {
    addError(
      t('pci_additional_ips_imports_import_error', {
        ip: decodeURIComponent(ipToMove),
        error,
        interpolation: {
          escapeValue: false,
        },
      }),
    );

    navigate('../../floating-ips');
  };

  const { moveIP, isPending } = useMoveIP({
    projectId,
    onSuccess: handleMoveIPSuccess,
    onError: handleMoveIPError,
  });

  const handleModalConfirm = () => moveIP(ipToMove);

  return (
    <PciModal
      title={t('pci_additional_ips_failoverip_imports_import_title')}
      onClose={handleModalClose}
      onCancel={handleModalClose}
      onConfirm={handleModalConfirm}
      cancelText={t(
        'pci_additional_ips_failoverip_imports_import_cancel_label',
      )}
      submitText={t(
        'pci_additional_ips_failoverip_imports_import_submit_label',
      )}
      isPending={isPending}
      isDisabled={isPending}
    >
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('pci_additional_ips_failoverip_imports_import_description')}
      </OsdsText>
    </PciModal>
  );
}
