import { useTranslation } from 'react-i18next';

import { TVolume, useVolumes } from '@ovh-ux/manager-pci-common';
import {
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';

type VolumeSelectStepProps = {
  selectedVolume: TVolume | undefined;
  onVolumeChange: (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => void;
};

export default function VolumeSelectStep({
  selectedVolume,
  onVolumeChange,
}: VolumeSelectStepProps) {
  const { t } = useTranslation('create');

  const { projectId } = useParams();
  const { data: volumes } = useVolumes(projectId || '');

  return (
    <div className="flex flex-col">
      <OdsText preset="heading-3">
        {t('pci_projects_project_storages_volume_backup_create_step_1_title')}
      </OdsText>

      <OdsFormField className="md:w-[30rem]">
        <OdsText preset="caption" className="fw-bold">
          {t(
            'pci_projects_project_storages_volume_backup_create_step_1_select_placeholder',
          )}
        </OdsText>
        <OdsSelect
          name="block-storage-volume"
          value={selectedVolume?.id}
          onOdsChange={onVolumeChange}
          placeholder={t(
            'pci_projects_project_storages_volume_backup_create_step_1_select_placeholder',
          )}
        >
          {volumes?.map((volume) => (
            <option value={volume.id} key={volume.id}>
              {volume.name}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
    </div>
  );
}
