import { useTranslation } from 'react-i18next';

import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { TVolume } from '@ovh-ux/manager-pci-common';

export default function DetachVolumeStep({
  volume,
  resetForm,
}: {
  volume?: TVolume;
  resetForm: () => void;
}) {
  const { t } = useTranslation('create');

  const navigate = useNavigate();

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
        onClick={() => {
          navigate(
            `./detach-volume?volumeId=${volume?.id}&instanceId=${volume?.attachedTo[0]}`,
          );
          resetForm();
        }}
      ></OdsButton>
    </div>
  );
}
