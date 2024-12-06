import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useRemoveSsh, useSshKey } from '@/api/hooks/useSsh';

interface RemoveSshModalProps {
  projectId: string;
  sshId: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (cause: Error) => void;
}

export default function RemoveSshModal({
  projectId,
  sshId,
  onClose,
  onSuccess,
  onError,
}: RemoveSshModalProps) {
  const { t } = useTranslation('common');
  const { data: sshKey, isPending } = useSshKey(projectId || '', sshId || '');
  const { remove, isPending: isPendingRemoveSsh } = useRemoveSsh({
    projectId: `${projectId}`,
    sshId: sshKey?.id || '',
    onError: (err) => {
      onClose();
      onError(err);
    },
    onSuccess: () => {
      onClose();
      onSuccess();
    },
  });

  return (
    <DeletionModal
      title={t('pci_projects_project_sshKeys_remove')}
      data-testid="RemoveSshModal-modal"
      onClose={onClose}
      onConfirm={remove}
      isPending={isPending || isPendingRemoveSsh}
      submitText={t('pci_projects_project_sshKeys_remove_submit_label')}
      cancelText={t('pci_projects_project_sshKeys_remove_cancel_label')}
      isDisabled={isPending || isPendingRemoveSsh}
      onCancel={onClose}
    >
      <OsdsText
        slot="label"
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('pci_projects_project_sshKeys_remove_description', {
          name: sshKey?.name,
        })}
      </OsdsText>
    </DeletionModal>
  );
}
