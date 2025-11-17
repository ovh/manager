import React, { useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
      resType: z.union([
        z.nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum),
        z.literal('CUSTOM'),
      ]),
      averageUsage: z.coerce
        .number()
        .min(1)
        .max(100)
        .optional(),
      metricUrl: z.string(),
      dataFormat: z
        .nativeEnum(ai.app.CustomMetricsFormatEnum)
        .nullable()
        .optional(),
      dataLocation: z.string(),
      targetMetricValue: z.coerce
        .number()
        .min(0)
        .optional(),
      aggregationType: z
        .nativeEnum(ai.app.CustomMetricsAggregationTypeEnum)
        .optional(),
    })
    .superRefine((values, context) => {
      if (values.maxRep < values.minRep) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errorFormMinMaxRepField'),
          path: ['minRep'],
        });
      }

      // Validations spécifiques au mode CUSTOM
      if (values.resType !== 'CUSTOM') return;

      (!values.metricUrl || values.metricUrl.trim() === '') &&
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('metricUrlRequired'),
          path: ['metricUrl'],
        });

      !values.dataFormat &&
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('dataFormatRequired'),
          path: ['dataFormat'],
        });

      (!values.dataLocation || values.dataLocation.trim() === '') &&
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('dataLocationRequired'),
          path: ['dataLocation'],
        });

      (values.targetMetricValue === undefined ||
        values.targetMetricValue === null) &&
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('targetMetricValueRequired'),
          path: ['targetMetricValue'],
        });

      values.targetMetricValue !== undefined &&
        values.targetMetricValue < 0 &&
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('targetMetricValueMinimum'),
          path: ['targetMetricValue'],
        });

      (!values.aggregationType || values.aggregationType.trim() === '') &&
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('aggregationTypeRequired'),
          path: ['aggregationType'],
        });
    });

  const scalingForm = useForm({
    resolver: zodResolver(scalingSchema),
    defaultValues: {
      minRep: scaling.replicasMin,
      maxRep: scaling.replicasMax,
      resType: scaling.resourceType,
      averageUsage: scaling.averageUsageTarget,
      metricUrl: scaling.metricUrl || '',
      dataFormat: scaling.dataFormat ?? ai.app.CustomMetricsFormatEnum.JSON,
      dataLocation: scaling.dataLocation || '',
      targetMetricValue: scaling.targetMetricValue,
      aggregationType:
        scaling.aggregationType ??
        ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = scalingForm;

  const handleChange = async () => {
    const isValid = await trigger();

    const resType = watch('resType') as
      | ai.app.ScalingAutomaticStrategyResourceTypeEnum
      | 'CUSTOM';

    onChange({
      ...scaling,
      replicasMin: watch('minRep'),
      replicasMax: watch('maxRep'),
      averageUsageTarget: watch('averageUsage'),
      resourceType: resType,
      metricUrl: watch('metricUrl'),
      dataFormat: watch('dataFormat'),
      dataLocation: watch('dataLocation'),
      targetMetricValue: watch('targetMetricValue'),
      aggregationType: watch('aggregationType'),
    });

    onNonValidForm?.(!isValid);
  };

  const isCustomSelected = watch('resType') === 'CUSTOM';

  useEffect(() => {
    if (isCustomSelected) {
      handleChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...scalingForm}>
      <div data-testid="auto-scaling-container" ref={ref}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6 mb-4">
          <div className="xl:col-start-1 xl:row-start-1 w-full">
            <FormField
              control={scalingForm.control}
              name="minRep"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2 mb-2">
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="xl:col-start-1 xl:row-start-2 w-full">
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="xl:col-start-2 xl:row-start-1 w-full">
            <FormField
              control={scalingForm.control}
              name="resType"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2 mb-2">
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
                    className="mb-2"
                    name="access-type"
                    value={watch('resType') || scaling.resourceType}
                    onValueChange={(
                      newResourceType:
                        | ai.app.ScalingAutomaticStrategyResourceTypeEnum
                        | 'CUSTOM',
                    ) => {
                      setValue('resType', newResourceType, {
                        shouldValidate: true,
                      });
                      if (newResourceType === 'CUSTOM') {
                        setValue(
                          'dataFormat',
                          ai.app.CustomMetricsFormatEnum.JSON,
                          {
                            shouldValidate: false,
                          },
                        );
                        setValue(
                          'aggregationType',
                          ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
                          {
                            shouldValidate: false,
                          },
                        );
                      }
                      handleChange();
                    }}
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
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          data-testid="radio-custom"
                          value="CUSTOM"
                          id="custom-radio"
                        />
                        <Label>CUSTOM</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </FormItem>
              )}
            />
          </div>

          {!isCustomSelected && (
            <div className="xl:col-start-2 xl:row-start-2 w-full">
              <FormField
                control={scalingForm.control}
                name="averageUsage"
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
                        value={[scaling.averageUsageTarget || 75]}
                        min={0}
                        max={100}
                        step={1}
                      />
                      <div
                        data-testid="storage-unit-value-container"
                        className="flex w-full justify-center mt-2"
                      >
                        <span className="font-bold">
                          {scaling.averageUsageTarget || 75} %
                        </span>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
          {isCustomSelected && (
            <>
              <div className="w-full xl:col-start-2 xl:row-start-2">
                <FormField
                  control={scalingForm.control}
                  name="metricUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm">{t('metricUrlLabel')}</p>
                        <Popover>
                          <PopoverTrigger>
                            <HelpCircle className="size-4" />
                          </PopoverTrigger>
                          <PopoverContent className="text-sm">
                            <p>{t('metricUrlInfo')}</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormControl>
                        <Input
                          data-testid="metric-url-input"
                          {...field}
                          placeholder={t('metricUrlPlaceholder')}
                          onChange={(e) => {
                            setValue('metricUrl', e.target.value, {
                              shouldValidate: true,
                            });
                            handleChange();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full xl:col-start-2 xl:row-start-3">
                <FormField
                  control={scalingForm.control}
                  name="dataFormat"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm">{t('dataFormatLabel')}</p>
                        <Popover>
                          <PopoverTrigger>
                            <HelpCircle className="size-4" />
                          </PopoverTrigger>
                          <PopoverContent className="text-sm">
                            <p>{t('dataFormatInfo')}</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Select
                        value={field.value || ai.app.CustomMetricsFormatEnum.JSON}
                        onValueChange={(value) => {
                          setValue(
                            'dataFormat',
                            value as ai.app.CustomMetricsFormatEnum,
                            {
                              shouldValidate: true,
                            },
                          );
                          handleChange();
                        }}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="data-format-select">
                            <SelectValue
                              placeholder={ai.app.CustomMetricsFormatEnum.JSON}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ai.app.CustomMetricsFormatEnum.JSON}>
                            {ai.app.CustomMetricsFormatEnum.JSON}
                          </SelectItem>
                          <SelectItem value={ai.app.CustomMetricsFormatEnum.XML}>
                            {ai.app.CustomMetricsFormatEnum.XML}
                          </SelectItem>
                          <SelectItem value={ai.app.CustomMetricsFormatEnum.YAML}>
                            {ai.app.CustomMetricsFormatEnum.YAML}
                          </SelectItem>
                          <SelectItem
                            value={ai.app.CustomMetricsFormatEnum.PROMETHEUS}
                          >
                            {ai.app.CustomMetricsFormatEnum.PROMETHEUS}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full xl:col-start-1 xl:row-start-3">
                <FormField
                  control={scalingForm.control}
                  name="dataLocation"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm">{t('dataLocationLabel')}</p>
                        <Popover>
                          <PopoverTrigger>
                            <HelpCircle className="size-4" />
                          </PopoverTrigger>
                          <PopoverContent className="text-sm">
                            <p>{t('dataLocationInfo')}</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormControl>
                        <Input
                          data-testid="data-location-input"
                          {...field}
                          placeholder={t('dataLocationPlaceholder')}
                          onChange={(e) => {
                            setValue('dataLocation', e.target.value, {
                              shouldValidate: true,
                            });
                            handleChange();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full xl:col-start-2 xl:row-start-4">
                <FormField
                  control={scalingForm.control}
                  name="targetMetricValue"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm">{t('targetMetricValueLabel')}</p>
                        <Popover>
                          <PopoverTrigger>
                            <HelpCircle className="size-4" />
                          </PopoverTrigger>
                          <PopoverContent className="text-sm">
                            <p>{t('targetMetricValueInfo')}</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormControl>
                        <Input
                          data-testid="target-metric-value-input"
                          {...field}
                          type="number"
                          min={0}
                          step="0.5"
                          onChange={(e) => {
                            setValue(
                              'targetMetricValue',
                              Number(e.target.value),
                              {
                                shouldValidate: true,
                              },
                            );
                            handleChange();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full xl:col-start-1 xl:row-start-4">
                <FormField
                  control={scalingForm.control}
                  name="aggregationType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm">{t('aggregationTypeLabel')}</p>
                        <Popover>
                          <PopoverTrigger>
                            <HelpCircle className="size-4" />
                          </PopoverTrigger>
                          <PopoverContent className="text-sm">
                            <p>{t('aggregationTypeInfo')}</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormControl>
                        <Select
                          value={
                            field.value ||
                            ai.app.CustomMetricsAggregationTypeEnum.AVERAGE
                          }
                          onValueChange={(value) => {
                            setValue(
                              'aggregationType',
                              value as ai.app.CustomMetricsAggregationTypeEnum,
                              {
                                shouldValidate: true,
                              },
                            );
                            handleChange();
                          }}
                        >
                          <SelectTrigger data-testid="aggregation-type-select">
                            <SelectValue
                              placeholder={
                                ai.app.CustomMetricsAggregationTypeEnum.AVERAGE
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value={
                                ai.app.CustomMetricsAggregationTypeEnum.AVERAGE
                              }
                            >
                              {ai.app.CustomMetricsAggregationTypeEnum.AVERAGE}
                            </SelectItem>
                            <SelectItem
                              value={ai.app.CustomMetricsAggregationTypeEnum.MIN}
                            >
                              {ai.app.CustomMetricsAggregationTypeEnum.MIN}
                            </SelectItem>
                            <SelectItem
                              value={ai.app.CustomMetricsAggregationTypeEnum.MAX}
                            >
                              {ai.app.CustomMetricsAggregationTypeEnum.MAX}
                            </SelectItem>
                            <SelectItem
                              value={ai.app.CustomMetricsAggregationTypeEnum.SUM}
                            >
                              {ai.app.CustomMetricsAggregationTypeEnum.SUM}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
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
