import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type TDeleteModal = {
  networkId: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({
  networkId,
  isPending,
  onClose,
  onConfirm,
}: Readonly<TDeleteModal>) {
  const { t } = useTranslation('listing');
  return (
    <DeletionModal
      title={t('pci_projects_project_network_private_delete_label')}
      onClose={onClose}
      isPending={isPending}
      isDisabled={isPending}
      onCancel={onClose}
      onConfirm={onConfirm}
      cancelText={t('pci_projects_project_network_private_delete_cancel')}
      submitText={t('pci_projects_project_network_private_delete_confirm')}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {t('pci_projects_project_network_private_delete_confirmation', {
          name: networkId,
        })}
      </OsdsText>
    </DeletionModal>
  );
}
