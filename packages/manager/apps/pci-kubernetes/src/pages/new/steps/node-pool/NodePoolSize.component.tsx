import { useTranslation } from 'react-i18next';

import { ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

import { Autoscaling } from '@/components/Autoscaling.component';
import { TScalingState } from '@/types';

export interface NodeSizeStepProps {
  isMonthlyBilled: boolean;
  antiAffinity: boolean;
  onScaleChange: (scaling: TScalingState) => void;
}

export default function NodePoolSize({
  onScaleChange,
  isMonthlyBilled,
  antiAffinity,
}: Readonly<NodeSizeStepProps>) {
  const { t } = useTranslation('node-pool');
  return (
    <div className="mb-8">
      <OsdsText
        className="font-bold"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        slot="label"
      >
        {t('kube_common_node_pool_size_title')}
      </OsdsText>
      <Autoscaling
        autoscale={false}
        isAntiAffinity={antiAffinity}
        onChange={onScaleChange}
        isMonthlyBilling={isMonthlyBilled}
      />
    </div>
  );
}
