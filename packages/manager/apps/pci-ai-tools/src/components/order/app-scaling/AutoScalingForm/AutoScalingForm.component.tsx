import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@datatr-ux/uxlib';

import Price from '@/components/price/Price.component';
import { AppPricing, Scaling } from '@/types/orderFunnel';
import {
  createScalingSchema,
  getInitialValues,
  toScaling,
  ScalingFormValues,
} from '@/lib/scalingHelper';
import { ReplicaFields } from './ReplicaFields';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { CpuRamFields } from './CpuRamFields';
import { CustomMetricsFields } from './CustomMetricsFields';

interface AutoScalingFormProps {
  scaling: Scaling;
  onChange: (scalingStrat: Scaling) => void;
  pricingFlavor?: AppPricing;
  onNonValidForm?: (isPending: boolean) => void;
}

export const AutoScalingForm = React.forwardRef<
  HTMLDivElement,
  AutoScalingFormProps
>(({ scaling, onChange, pricingFlavor, onNonValidForm }, ref) => {
  const { t } = useTranslation('ai-tools/components/scaling');

  const schema = useMemo(() => createScalingSchema(t), [t]);

  const form = useForm<ScalingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getInitialValues(scaling),
    mode: 'onChange',
  });

  const { control, setValue, getValues } = form;

  const resType = useWatch({ control, name: 'resType' });
  const minRep = useWatch({ control, name: 'minRep' });

  const isCustom = resType === 'CUSTOM';

  const notify = useCallback(() => {
    const values = getValues();
    const isValid = schema.safeParse(values).success;

    onChange(toScaling(scaling, values));
    onNonValidForm?.(!isValid);
  }, [getValues, onChange, onNonValidForm, scaling, schema]);

  return (
    <Form {...form}>
      <div data-testid="auto-scaling-container" ref={ref}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6 mb-4">
          <ReplicaFields control={control} onFieldChange={notify} />
          <ResourceTypeSelector
            control={control}
            setValue={setValue}
            onFieldChange={notify}
          />
          {!isCustom && (
            <CpuRamFields control={control} onFieldChange={notify} />
          )}
          {isCustom && (
            <CustomMetricsFields control={control} onFieldChange={notify} />
          )}
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
    </Form>
  );
});
