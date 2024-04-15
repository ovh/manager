import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type TerminateModalProps = {
  ip: string;
  isPending: boolean;
  isPendingTerminate: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function TerminateModal({
  ip,
  isPending,
  isPendingTerminate,
  onClose,
  onConfirm,
}: Readonly<TerminateModalProps>) {
  const { t } = useTranslation();
  return (
    <OsdsModal
      headline={
        !isPending
          ? t('pci_additional_ips_floating_ips_floating_ip_terminate_title', {
            ip,
          })
          : ''
      }
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {(isPending || isPendingTerminate) && (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="terminateModal-spinner"
          />
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
        data-testid="terminateModal-button_cancel"
      >
        {t('pci_additional_ips_floating_ips_floating_ip_terminate_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        {...(isPending || isPendingTerminate ? { disabled: true } : {})}
        data-testid="terminateModal-button_submit"
      >
        {t('pci_additional_ips_floating_ips_floating_ip_terminate_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
