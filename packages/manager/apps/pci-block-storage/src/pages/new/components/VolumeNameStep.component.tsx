import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { ODS_INPUT_TYPE, ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepState } from '@/pages/new/hooks/useStep';

interface VolumeNameStepProps {
  projectId: string;
  step: StepState;
  onSubmit: (volumeName: string) => void;
}

export function VolumeNameStep({
  step,
  onSubmit,
}: Readonly<VolumeNameStepProps>) {
  const { t } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');
  const [volumeName, setVolumeName] = useState('');
  const [isInputTouched, setIsInputTouched] = useState(false);
  const missingNameError = isInputTouched && !volumeName;
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
          defaultValue={volumeName}
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
          <OsdsButton
            className="w-fit"
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            {...(!volumeName ? { disabled: true } : {})}
            onClick={() => onSubmit(volumeName)}
          >
            {tStepper('common_stepper_next_button_label')}
          </OsdsButton>
        )}
      </div>
    </>
  );
}
