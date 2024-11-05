import { DeletionModal } from '@ovh-ux/manager-pci-common';
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
    <DeletionModal
      title={
        !isPending
          ? t('pci_additional_ips_floating_ips_floating_ip_terminate_title', {
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
    ></DeletionModal>
  );
}
