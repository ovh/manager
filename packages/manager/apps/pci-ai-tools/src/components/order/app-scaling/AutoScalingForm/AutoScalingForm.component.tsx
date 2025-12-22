import { useFormContext, useWatch } from 'react-hook-form';

import Price from '@/components/price/Price.component';
import { AppPricing } from '@/types/orderFunnel';
import { ScalingStrategySchema, ResourceType } from '../scalingHelper';
import { ReplicaFields } from './ReplicaFields';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { CpuRamFields } from './CpuRamFields';
import { CustomMetricsFields } from './CustomMetricsFields';

interface AutoScalingFormProps {
  pricingFlavor?: AppPricing;
}

export function AutoScalingForm({ pricingFlavor }: AutoScalingFormProps) {
  const { control } = useFormContext<ScalingStrategySchema>();
  const resType = useWatch({ control, name: 'resourceType' });
  const minRep = useWatch({ control, name: 'replicasMin' });

  const isCustom = resType === ResourceType.CUSTOM;

  return (
    <div data-testid="auto-scaling-container">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6 mb-4">
        <ReplicaFields />
        <ResourceTypeSelector />
        {!isCustom && <CpuRamFields />}
        {isCustom && <CustomMetricsFields />}
      </div>
    </div>
  );
}
