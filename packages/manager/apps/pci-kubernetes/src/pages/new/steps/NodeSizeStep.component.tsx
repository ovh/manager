import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepState } from '../useStep';
import {
  Autoscaling,
  AutoscalingState,
} from '@/components/Autoscaling.component';

export interface NodeSizeStepProps {
  isMonthlyBilling: boolean;
  onSubmit: (scaling: AutoscalingState) => void;
  step: StepState;
}

export function NodeSizeStep({
  isMonthlyBilling,
  onSubmit,
  step,
}: Readonly<NodeSizeStepProps>) {
  const { t: tStepper } = useTranslation('stepper');
  const [scaling, setScaling] = useState<AutoscalingState>();
  return (
    <>
      <div className="mb-8">
        <Autoscaling
          autoscale={false}
          isAntiAffinity={false}
          onChange={setScaling}
          isMonthlyBilling={isMonthlyBilling}
        />
      </div>
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={scaling ? undefined : true}
          onClick={() => scaling && onSubmit(scaling)}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
