import React from 'react';
import { Control, useWatch } from 'react-hook-form';

import Price from '@/components/price/Price.component';
import { AppPricing } from '@/types/orderFunnel';
import { ScalingFormValues } from '@/lib/scalingHelper';
import { ReplicaFields } from './ReplicaFields';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { CpuRamFields } from './CpuRamFields';
import { CustomMetricsFields } from './CustomMetricsFields';

interface AutoScalingFormProps {
  control: Control<ScalingFormValues>;
  pricingFlavor?: AppPricing;
}

export const AutoScalingForm = React.forwardRef<
  HTMLDivElement,
  AutoScalingFormProps
>(function AutoScalingForm({ control, pricingFlavor }, ref) {
  const resType = useWatch({ control, name: 'resourceType' });
  const minRep = useWatch({ control, name: 'replicasMin' });

  const isCustom = resType === 'CUSTOM';

  return (
    <div ref={ref} data-testid="auto-scaling-container">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6 mb-4">
        <ReplicaFields control={control} />
        <ResourceTypeSelector control={control} />
        {!isCustom && <CpuRamFields control={control} />}
        {isCustom && <CustomMetricsFields control={control} />}
      </div>
      {pricingFlavor && (
        <div>
          <Price
            decimals={2}
            displayInHour={true}
            priceInUcents={(minRep ?? 1) * 60 * pricingFlavor.price}
            taxInUcents={(minRep ?? 1) * 60 * pricingFlavor.tax}
          />
        </div>
      )}
    </div>
  );
});
