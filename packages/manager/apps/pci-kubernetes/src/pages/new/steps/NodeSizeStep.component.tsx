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
    </>
  );
}
