import { OsdsText } from '@ovhcloud/ods-components/react';

import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';

import {
  Autoscaling,
  AutoscalingState,
} from '@/components/Autoscaling.component';

export interface NodeSizeStepProps {
  isMonthlyBilled: boolean;
  onScaleChange: (scaling: AutoscalingState) => void;
}

export default function NodePoolSize({
  onScaleChange,
  isMonthlyBilled,
}: Readonly<NodeSizeStepProps>) {
  return (
    <div className="mb-8">
      <Autoscaling
        autoscale={false}
        isAntiAffinity={false}
        onChange={onScaleChange}
        isMonthlyBilling={isMonthlyBilled}
      />
    </div>
  );
}
