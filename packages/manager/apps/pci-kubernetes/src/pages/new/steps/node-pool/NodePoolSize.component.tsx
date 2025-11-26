import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Autoscaling } from '@/components/Autoscaling.component';
import { TScalingState, TSelectedAvailabilityZones } from '@/types';

export type TNodeSizeStepProps = {
  isMonthlyBilled: boolean;
  antiAffinity: boolean;
  isAutoscale: boolean;
  initialScaling: TScalingState['quantity'];
  onScaleChange: (scaling: TScalingState) => void;
  selectedAvailabilityZones?: TSelectedAvailabilityZones | null;
};

export default function NodePoolSize({
  onScaleChange,
  isAutoscale,
  initialScaling,
  isMonthlyBilled,
  antiAffinity,
  selectedAvailabilityZones,
}: Readonly<TNodeSizeStepProps>) {
  const { t } = useTranslation('node-pool');

  const totalNodes = useMemo(() => {
    const zonesChecked = selectedAvailabilityZones?.filter((e) => e.checked).length ?? 0;
    const desiredNodes = initialScaling?.desired;
    if (!zonesChecked || !desiredNodes) return null;
    const total = desiredNodes * zonesChecked;
    return total === desiredNodes ? null : total;
  }, [selectedAvailabilityZones, initialScaling]);

  return (
    <div className="mb-8">
      <Text className="font-bold text-[--ods-color-text-500]" preset={TEXT_PRESET.heading4}>
        {t('kube_common_node_pool_size_title')}
      </Text>
      <Autoscaling
        initialScaling={initialScaling}
        isAutoscale={isAutoscale}
        isAntiAffinity={antiAffinity}
        onChange={onScaleChange}
        isMonthlyBilling={isMonthlyBilled}
        totalNodes={totalNodes}
      />
    </div>
  );
}
