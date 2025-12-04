import React from 'react';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';

import ai from '@/types/AI';
import { ScalingFormValues } from '@/lib/scalingHelper';

interface CustomMetricsFieldsProps {
  control: Control<ScalingFormValues>;
  onFieldChange: () => void;
}

export const CustomMetricsFields: React.FC<CustomMetricsFieldsProps> = ({
  control,
  onFieldChange,
}) => {
  const { t } = useTranslation('ai-tools/components/scaling');

  return (
    <>
      <div className="w-full xl:col-start-2 xl:row-start-2">
        <FormField
          control={control}
          name="metricUrl"
          render={({ field, fieldState }) => {
            const isEmpty = !field.value || !field.value.trim();
            const errorMessage =
              fieldState.error?.message ??
              (isEmpty ? t('metricUrlRequired') : undefined);

            return (
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
                      field.onChange(e);
                      onFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage>{errorMessage}</FormMessage>
              </FormItem>
            );
          }}
        />
      </div>
      <div className="w-full xl:col-start-2 xl:row-start-3">
        <FormField
          control={control}
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
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onFieldChange();
                }}
              >
                <FormControl>
                  <SelectTrigger data-testid="data-format-select">
                    <SelectValue />
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
                  <SelectItem value={ai.app.CustomMetricsFormatEnum.PROMETHEUS}>
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
          control={control}
          name="dataLocation"
          render={({ field, fieldState }) => {
            const isEmpty = !field.value || !field.value.trim();
            const errorMessage =
              fieldState.error?.message ??
              (isEmpty ? t('dataLocationRequired') : undefined);

            return (
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
                      field.onChange(e);
                      onFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage>{errorMessage}</FormMessage>
              </FormItem>
            );
          }}
        />
      </div>
      <div className="w-full xl:col-start-2 xl:row-start-4">
        <FormField
          control={control}
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
                    field.onChange(Number(e.target.value));
                    onFieldChange();
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
          control={control}
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
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onFieldChange();
                  }}
                >
                  <SelectTrigger data-testid="aggregation-type-select">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem
                      value={ai.app.CustomMetricsAggregationTypeEnum.AVERAGE}
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
  );
};
