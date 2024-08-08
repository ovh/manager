import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepState } from '../useStep';
import NetworkClusterStep, {
  TFormState,
} from '@/components/create/NetworkClusterStep.component';

export interface NetworkStepProps {
  region: string;
  onSubmit: () => void;
  step: StepState;
}

export function NetworkStep({
  region,
  onSubmit,
  step,
}: Readonly<NetworkStepProps>) {
  const { t: tStepper } = useTranslation('stepper');
  const [state, setState] = useState<TFormState>({
    regionName: region,
  } as TFormState);
  return (
    <>
      <NetworkClusterStep formState={state} setFormState={setState} />
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={onSubmit}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
