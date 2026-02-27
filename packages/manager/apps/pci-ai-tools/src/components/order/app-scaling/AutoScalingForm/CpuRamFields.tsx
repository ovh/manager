import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormField,
  FormItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@datatr-ux/uxlib';
import { ScalingStrategySchema, SCALING_DEFAULTS } from '../scalingHelper';

export function CpuRamFields() {
  const { t } = useTranslation('ai-tools/components/scaling');
  const { control } = useFormContext<ScalingStrategySchema>();
  const averageUsageTarget = useWatch({ control, name: 'averageUsageTarget' });

  return (
    <div className="w-full">
      <FormField
        control={control}
        name="averageUsageTarget"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2 mb-2">
              <p className="text-sm">{t('treshholderTargetLabel')}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button">
                    <HelpCircle className="size-4" />
                  </button>
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
                data-testid="resource-usage-slider"
                onValueChange={([newValue]) => field.onChange(newValue)}
                id="resource-usage-select"
                value={[averageUsageTarget]}
                min={0}
                max={100}
                step={1}
              />
              <div
                data-testid="storage-unit-value-container"
                className="flex w-full justify-center mt-2"
              >
                <span className="font-bold">{averageUsageTarget} %</span>
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
