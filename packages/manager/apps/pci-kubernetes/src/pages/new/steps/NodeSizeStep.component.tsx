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
import { NODE_RANGE } from '@/constants';

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

  // The maxValue is NODE_RANGE.MAX cause isAntiAffinity is hardcoded to false
  // change to ANTI_AFFINITY_MAX_NODES otherwise
  const isNextDisabled =
    !scaling ||
    (!scaling.isAutoscale && scaling.quantity.desired > NODE_RANGE.MAX) ||
    (scaling.isAutoscale &&
      (scaling.quantity.min > NODE_RANGE.MAX ||
        scaling.quantity.max > NODE_RANGE.MAX ||
        scaling.quantity.min >= scaling.quantity.max));

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
          {...(isNextDisabled ? { disabled: true } : {})}
          onClick={() => scaling && onSubmit(scaling)}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
