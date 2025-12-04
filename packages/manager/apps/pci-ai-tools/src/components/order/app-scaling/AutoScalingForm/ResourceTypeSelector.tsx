import React from 'react';
import { useTranslation } from 'react-i18next';
import { Control, UseFormSetValue } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import {
  FormField,
  FormItem,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
} from '@datatr-ux/uxlib';

import ai from '@/types/AI';
import { SCALING_DEFAULTS, ScalingFormValues } from '@/lib/scalingHelper';

interface ResourceTypeSelectorProps {
  control: Control<ScalingFormValues>;
  setValue: UseFormSetValue<ScalingFormValues>;
  onFieldChange: () => void;
}

export const ResourceTypeSelector: React.FC<ResourceTypeSelectorProps> = ({
  control,
  setValue,
  onFieldChange,
}) => {
  const { t } = useTranslation('ai-tools/components/scaling');

  return (
    <div className="xl:col-start-2 xl:row-start-1 w-full">
      <FormField
        control={control}
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
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                if (value === 'CUSTOM') {
                  setValue('dataFormat', SCALING_DEFAULTS.DATA_FORMAT);
                  setValue('aggregationType', SCALING_DEFAULTS.AGGREGATION_TYPE);
                }
                onFieldChange();
              }}
              className="mb-2"
            >
              <div className="flex flex-row gap-8">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    data-testid="radio-cpu"
                    value={ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU}
                    id="cpu-radio"
                  />
                  <Label>
                    {ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    data-testid="radio-ram"
                    value={ai.app.ScalingAutomaticStrategyResourceTypeEnum.RAM}
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
  );
};
