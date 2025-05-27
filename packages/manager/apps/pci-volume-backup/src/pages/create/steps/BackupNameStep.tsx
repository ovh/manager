import { useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  OdsInputChangeEventDetail,
  OdsInputCustomEvent,
} from '@ovhcloud/ods-components';

type BackupNameProps = {
  backupName: string;
  onBackupNameChange: (
    event: OdsInputCustomEvent<OdsInputChangeEventDetail>,
  ) => void;
};

export default function BackupNameStep({
  backupName,
  onBackupNameChange,
}: BackupNameProps) {
  const { t } = useTranslation('create');

  return (
    <div className="flex flex-col">
      <OdsText preset="heading-3">
        {t('pci_projects_project_storages_volume_backup_create_step_4_title')}
      </OdsText>

      <OdsFormField className="md:w-[30rem]">
        <OdsText preset="caption" className="fw-bold">
          {t(
            'pci_projects_project_storages_volume_backup_create_step_4_input_label',
          )}
        </OdsText>

        <OdsInput
          data-testid="BackupNameStep-input"
          name="backup-name"
          value={backupName}
          onOdsChange={onBackupNameChange}
        />
      </OdsFormField>
    </div>
  );
}
