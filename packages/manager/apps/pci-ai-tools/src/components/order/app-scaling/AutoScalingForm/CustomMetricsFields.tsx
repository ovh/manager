import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { OdsQuantity } from '@ovhcloud/ods-components/react';
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
import { ScalingStrategySchema } from '../scalingHelper';

export function CustomMetricsFields() {
  const { t } = useTranslation('ai-tools/components/scaling');
  const { control } = useFormContext<ScalingStrategySchema>();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6">
      <div className="w-full">
        <FormField
          control={control}
          name="metricUrl"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-sm">{t('metricUrlLabel')}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button">
                      <HelpCircle className="size-4" />
                    </button>
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
                  autoComplete="url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="w-full">
        <FormField
          control={control}
          name="dataLocation"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-sm">{t('dataLocationLabel')}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button">
                      <HelpCircle className="size-4" />
                    </button>
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
                  autoComplete="on"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="w-full">
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
              <Select {...field} onValueChange={field.onChange}>
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
      <div className="w-full">
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
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger data-testid="aggregation-type-select">
                    <SelectValue
                      placeholder={
                        ai.app.CustomMetricsAggregationTypeEnum.AVERAGE
                      }
                    />
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
      <div className="w-full">
        <FormField
          control={control}
          name="targetMetricValue"
          render={({ field, fieldState }) => (
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
                <OdsQuantity
                  ariaLabel={t('targetMetricValueLabel')}
                  data-testid="target-metric-value-input"
                  hasError={!!fieldState.error}
                  min={0}
                  name={field.name}
                  onOdsBlur={field.onBlur}
                  onOdsChange={(event) =>
                    field.onChange(event.detail.value ?? undefined)
                  }
                  step={0.5}
                  value={field.value ?? null}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
