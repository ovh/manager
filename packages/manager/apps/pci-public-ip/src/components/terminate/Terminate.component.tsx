import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

type TerminateModalProps = {
  ip?: string;
  title?: string;
  information?: string;
  isPending: boolean;
  isPendingTerminate: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function TerminateModal({
  ip,
  title,
  information,
  isPending,
  isPendingTerminate,
  onClose,
  onConfirm,
}: Readonly<TerminateModalProps>) {
  const { t } = useTranslation();
  return (
    <DeletionModal
      title={
        !isPending
          ? title ??
            t('pci_additional_ips_floating_ips_floating_ip_terminate_title', {
              ip,
            })
          : ''
      }
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      cancelText={t(
        'pci_additional_ips_floating_ips_floating_ip_terminate_cancel',
      )}
      submitText={t(
        'pci_additional_ips_floating_ips_floating_ip_terminate_confirm',
      )}
      isPending={isPending || isPendingTerminate}
      isDisabled={isPending || isPendingTerminate}
    >
      {!isPending && information && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.info}
          color={ODS_THEME_COLOR_INTENT.info}
          className="mb-4"
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {information}
          </OsdsText>
        </OsdsMessage>
      )}
    </DeletionModal>
  );
}
