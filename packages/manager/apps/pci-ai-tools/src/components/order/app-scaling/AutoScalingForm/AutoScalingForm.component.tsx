import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import Price from '@/components/price/Price.component';
import { AppPricing } from '@/types/orderFunnel';
import { ReplicaFields } from './ReplicaFields';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { CpuRamFields } from './CpuRamFields';
import { CustomMetricsFields } from './CustomMetricsFields';
import { ScalingStrategySchema } from './AutoScaling.schema';

interface AutoScalingInputsProps {
  pricingFlavor?: AppPricing;
}

export const AutoScalingInputs = React.forwardRef<
  HTMLDivElement,
  AutoScalingInputsProps
>(({ pricingFlavor }, ref) => {
  const form = useFormContext<ScalingStrategySchema>();
  const { t } = useTranslation('ai-tools/components/scaling');
  const { control } = form;

  const resType = useWatch({ control, name: 'scaling.resourceType' });
  const minRep = useWatch({ control, name: 'scaling.replicasMin' });

  const isCustom = resType === 'CUSTOM';

  return (
    <>
      <div data-testid="auto-scaling-container" ref={ref}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6 mb-4">
          <ReplicaFields />
          <ResourceTypeSelector />
          {!isCustom && <CpuRamFields />}
          {isCustom && <CustomMetricsFields />}
        </div>
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
    </>
  );
});

AutoScalingInputs.displayName = 'AutoScalingInputs';
