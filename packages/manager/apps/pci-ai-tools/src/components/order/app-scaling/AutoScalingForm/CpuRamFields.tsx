import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormField,
  FormItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@datatr-ux/uxlib';
import {
  SCALING_CONSTRAINTS,
  ScalingStrategySchema,
} from '../scalingHelper';

interface CpuRamFieldsProps<
  TFieldValues extends FieldValues & ScalingStrategySchema,
> {
  averageUsageTarget: number;
  control: Control<TFieldValues>;
}

export function CpuRamFields<
  TFieldValues extends FieldValues & ScalingStrategySchema,
>({
  averageUsageTarget,
  control,
}: CpuRamFieldsProps<TFieldValues>) {
  const { t } = useTranslation('ai-tools/components/scaling');

  return (
    <div className="w-full">
      <FormField
        control={control}
        name={'averageUsageTarget' as FieldPath<TFieldValues>}
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
                min={SCALING_CONSTRAINTS.AVERAGE_USAGE_TARGET.MIN}
                max={SCALING_CONSTRAINTS.AVERAGE_USAGE_TARGET.MAX}
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
