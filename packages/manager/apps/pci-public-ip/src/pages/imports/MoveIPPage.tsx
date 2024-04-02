import { useNavigate, useParams } from 'react-router-dom';

import { useNotifications } from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

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
        ip: ipToMove,
      }),
    );

    navigate('../../floating-ips');
  };

  const handleMoveIPError = (error: Error) => {
    addError(
      t('pci_additional_ips_imports_import_error', {
        ip: ipToMove,
        error,
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
    <OsdsModal
      headline={t('pci_additional_ips_failoverip_imports_import_title')}
      onOdsModalClose={handleModalClose}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
          />
        ) : (
          <div className="mt-5">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('pci_additional_ips_failoverip_imports_import_description')}
            </OsdsText>
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={handleModalClose}
      >
        {t('pci_additional_ips_failoverip_imports_import_cancel_label')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={handleModalConfirm}
        {...(isPending ? { disabled: true } : {})}
        data-testid="submitButton"
      >
        {t('pci_additional_ips_failoverip_imports_import_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
