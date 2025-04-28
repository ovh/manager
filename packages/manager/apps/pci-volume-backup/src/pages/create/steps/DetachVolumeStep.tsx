import { useTranslation } from 'react-i18next';

import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

export default function DetachVolumeStep() {
  const { t } = useTranslation('create');

  return (
    <div className="flex flex-col gap-5">
      <OdsText preset="heading-3">
        {t(
          'pci_projects_project_storages_volume_backup_create_step_3_detach_volume_from_instance_title',
        )}
      </OdsText>

      <OdsText preset="paragraph">
        {t(
          'pci_projects_project_storages_volume_backup_create_step_3_detach_volume_from_instance_description',
        )}
      </OdsText>

      <OdsButton
        variant="ghost"
        label={t(
          'pci_projects_project_storages_volume_backup_create_step_3_detach_volume_from_instance_action_detach',
        )}
        icon="arrow-right"
        iconAlignment="right"
      ></OdsButton>
    </div>
  );
}
