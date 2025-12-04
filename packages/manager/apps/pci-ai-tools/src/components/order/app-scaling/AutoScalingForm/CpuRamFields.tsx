import React from 'react';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import {
  FormField,
  FormItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@datatr-ux/uxlib';

import { ScalingFormValues } from '@/lib/scalingHelper';

interface CpuRamFieldsProps {
  control: Control<ScalingFormValues>;
  onFieldChange: () => void;
}

export const CpuRamFields: React.FC<CpuRamFieldsProps> = ({
  control,
  onFieldChange,
}) => {
  const { t } = useTranslation('ai-tools/components/scaling');

  return (
    <div className="xl:col-start-2 xl:row-start-2 w-full">
      <FormField
        control={control}
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
                value={[field.value ?? 75]}
                onValueChange={([value]) => {
                  field.onChange(value);
                  onFieldChange();
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
                <span className="font-bold">{field.value ?? 75} %</span>
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
