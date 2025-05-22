import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useMemo, useState } from 'react';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepState } from '@/pages/new/hooks/useStep';
import { TVolumeModel, useVolumePricing } from '@/api/hooks/useCatalog';
import { EncryptionType } from '@/api/select/volume';
import { Button } from '@/components/button/Button';

interface VolumeNameStepProps {
  projectId: string;
  step: StepState;
  onSubmit: (volumeName: string) => void;
  volumeType: TVolumeModel['name'];
  encryptionType: EncryptionType | null;
  region: string;
  volumeCapacity: number;
}

export function VolumeNameStep({
  projectId,
  step,
  onSubmit,
  volumeType,
  encryptionType,
  region,
  volumeCapacity,
}: Readonly<VolumeNameStepProps>) {
  const { t } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');

  const [volumeName, setVolumeName] = useState('');
  const [isInputTouched, setIsInputTouched] = useState(false);
  const missingNameError = isInputTouched && !volumeName;

  const { data } = useVolumePricing(
    projectId,
    region,
    volumeType,
    encryptionType,
    volumeCapacity,
  );

  const defaultVolumeName = useMemo(
    () => `${data.technicalName}-${region}-${volumeCapacity}GB`,
    [data, region, volumeCapacity],
  );

  return (
    <>
      <OsdsFormField
        error={missingNameError ? tStepper('common_field_error_required') : ''}
      >
        <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
          {t('pci_projects_project_storages_blocks_add_name_title')}
        </OsdsText>
        <OsdsInput
          type={ODS_INPUT_TYPE.text}
          defaultValue={defaultVolumeName}
          value={volumeName}
          color={
            missingNameError
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.primary
          }
          error={missingNameError}
          onOdsInputBlur={() => setIsInputTouched(true)}
          onOdsValueChange={(event) => {
            setIsInputTouched(true);
            setVolumeName(`${event.target.value}`);
          }}
        />
      </OsdsFormField>
      <div className="mt-6">
        {!step.isLocked && (
          <Button
            className="w-fit"
            size="md"
            color="primary"
            disabled={!volumeName}
            onClick={() => onSubmit(volumeName)}
            actionName="add_name"
          >
            {tStepper('common_stepper_next_button_label')}
          </Button>
        )}
      </div>
    </>
  );
}
