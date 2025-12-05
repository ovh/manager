import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import {
  FormField,
  FormItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@datatr-ux/uxlib';
import { ScalingStrategySchema } from './AutoScaling.schema';

export const CpuRamFields = () => {
  const { control } = useFormContext<ScalingStrategySchema>();
  const { t } = useTranslation('ai-tools/components/scaling');

  return (
    <div className="xl:col-start-2 xl:row-start-2 w-full">
      <FormField
        control={control}
        name="scaling.averageUsageTarget"
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
                value={[field.value]}
                onValueChange={([value]) => {
                  field.onChange(value);
                }}
                data-testid="resource-usage-slider"
                id="resource-usage-select"
                min={0}
                max={100}
                step={1}
              />
              <div
                data-testid="storage-unit-value-container"
                className="flex w-full justify-center mt-2"
              >
                <span className="font-bold">{field.value} %</span>
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
