import { useFormContext, useWatch } from 'react-hook-form';

import { AppPricing } from '@/types/orderFunnel';
import { ScalingStrategySchema, ResourceType } from '../scalingHelper';
import { ReplicaFields } from './ReplicaFields';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { CpuRamFields } from './CpuRamFields';
import { CustomMetricsFields } from './CustomMetricsFields';
import { ScalingDelayFields } from './ScalingDelayFields';

interface AutoScalingFormProps {
  pricingFlavor?: AppPricing;
}

export function AutoScalingForm({
  pricingFlavor: _pricingFlavor,
}: AutoScalingFormProps) {
  const { control } = useFormContext<ScalingStrategySchema>();
  const resType = useWatch({ control, name: 'resourceType' });
  const minRep = useWatch({ control, name: 'replicasMin' });

  const isCustom = resType === ResourceType.CUSTOM;
  const showScaleToZero = Number(minRep) === 0;

  return (
    <div data-testid="auto-scaling-container" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <ReplicaFields />
      </div>
      <div className="flex flex-col gap-4">
        <ResourceTypeSelector />
        {!isCustom && <CpuRamFields />}
        {isCustom && <CustomMetricsFields />}
      </div>
      <ScalingDelayFields showScaleToZero={showScaleToZero} />
    </div>
  );
}
