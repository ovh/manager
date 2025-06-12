import React from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Slider,
} from '@datatr-ux/uxlib';

import Price from '@/components/price/Price.component';
import { AppPricing, Scaling } from '@/types/orderFunnel';
import ai from '@/types/AI';

interface AutoScalingFormProps {
  scaling: Scaling;
  onChange: (scalingStrat: Scaling) => void;
  pricingFlavor?: AppPricing;
  onNonValidForm?: (isPending: boolean) => void;
}

export const AutoScalingForm = React.forwardRef<
  HTMLInputElement,
  AutoScalingFormProps
>(({ scaling, onChange, pricingFlavor, onNonValidForm }, ref) => {
  const { t } = useTranslation('ai-tools/components/scaling');

  const scalingSchema = z
    .object({
      minRep: z.coerce
        .number()
        .min(1)
        .max(100),
      maxRep: z.coerce
        .number()
        .min(1)
        .max(100),
      resType: z.nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum),
      averageUsage: z.coerce
        .number()
        .min(1)
        .max(100),
    })
    .superRefine((values, context) => {
      if (values.maxRep < values.minRep) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errorFormMinMaxRepField'),
          path: ['minRep'],
        });
      }
    });

  const scalingForm = useForm({
    resolver: zodResolver(scalingSchema),
    defaultValues: {
      minRep: scaling.replicasMin,
      maxRep: scaling.replicasMax,
      resType: scaling.resourceType,
      averageUsage: scaling.averageUsageTarget,
    },
    mode: 'onTouched',
  });

  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = scalingForm;

  const handleChange = async () => {
    const isValid = await trigger(); // Vérifie les erreurs
    if (isValid) {
      onChange({
        ...scaling,
        replicasMin: watch('minRep'),
        replicasMax: watch('maxRep'),
        averageUsageTarget: watch('averageUsage'),
        resourceType: watch('resType'),
      });
      onNonValidForm(false);
    } else {
      onNonValidForm(true);
    }
  };

  return (
    <Form {...scalingForm}>
      <div
        data-testid="auto-scaling-container"
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        <div className="mx-8">
          <FormField
            control={scalingForm.control}
            name="minRep"
            render={({ field }) => (
              <FormItem className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <p className="text-sm">{t('replicasMinInputLabel')}</p>
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>{t('haInfoHelper')}</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl>
                  <Input
                    data-testid="min-rep-input"
                    {...field}
                    ref={ref}
                    type="number"
                    max={100}
                    min={1}
                    onChange={(e) => {
                      setValue('minRep', Number(e.target.value), {
                        shouldValidate: true,
                      });
                      handleChange();
                    }}
                  />
                </FormControl>
                <FormMessage>{errors.minRep?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={scalingForm.control}
            name="maxRep"
            render={({ field }) => (
              <FormItem>
                <p className="text-sm">{t('replicasMaxInputLabel')}</p>
                <FormControl>
                  <Input
                    data-testid="max-rep-input"
                    {...field}
                    ref={ref}
                    type="number"
                    max={100}
                    min={1}
                    onChange={(e) => {
                      setValue('maxRep', Number(e.target.value), {
                        shouldValidate: true,
                      });
                      handleChange();
                    }}
                  />
                </FormControl>
                <FormMessage>{errors.minRep?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="mx-8">
          <FormField
            control={scalingForm.control}
            name="resType"
            render={({ field }) => (
              <FormItem className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <p className="text-sm">{t('resourceTypeLabel')}</p>
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>{t('resourceTypeInfo')}</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <RadioGroup
                  {...field}
                  className="my-8"
                  name="access-type"
                  value={scaling.resourceType}
                  onValueChange={(
                    newResourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum,
                  ) => onChange({ ...scaling, resourceType: newResourceType })}
                >
                  <div className="flex flex-row gap-8">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        data-testid="radio-cpu"
                        value={
                          ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU
                        }
                        id="cpu-radio"
                      />
                      <Label>
                        {ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        data-testid="radio-ram"
                        value={
                          ai.app.ScalingAutomaticStrategyResourceTypeEnum.RAM
                        }
                        id="ram-radio"
                      />
                      <Label>
                        {ai.app.ScalingAutomaticStrategyResourceTypeEnum.RAM}
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </FormItem>
            )}
          />

          <FormField
            control={scalingForm.control}
            name="averageUsage"
            // defaultValue={''}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-sm">{t('treshholderTargetLabel')}</p>
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>{t('treshholderTargetInfo')}</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">0</span>
                    <span className="text-sm">100</span>
                  </div>
                  <Slider
                    {...field}
                    ref={ref}
                    data-testid="resource-usage-slider"
                    onValueChange={([newValue]) =>
                      onChange({ ...scaling, averageUsageTarget: newValue })
                    }
                    id="resource-usage-select"
                    name="resource-usage-select"
                    value={[scaling.averageUsageTarget]}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <div
                    data-testid="storage-unit-value-container"
                    className="flex w-full justify-center mt-2"
                  >
                    <span className="font-bold">
                      {scaling.averageUsageTarget} %
                    </span>
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      {pricingFlavor && (
        <div>
          <Price
            decimals={2}
            displayInHour={true}
            priceInUcents={scaling.replicasMin * 60 * pricingFlavor.price}
            taxInUcents={scaling.replicasMin * 60 * pricingFlavor.tax}
          />
        </div>
      )}
    </Form>
  );
});
