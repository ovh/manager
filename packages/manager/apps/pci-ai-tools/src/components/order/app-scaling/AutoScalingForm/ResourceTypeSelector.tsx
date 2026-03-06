import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
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
import { ScalingStrategySchema, ResourceType } from '../scalingHelper';

export function ResourceTypeSelector() {
  const { t } = useTranslation('ai-tools/components/scaling');
  const { control } = useFormContext<ScalingStrategySchema>();

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm font-semibold">{t('triggerSectionTitle')}</p>
      <FormField
        control={control}
        name="resourceType"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2 mb-2">
              <p className="text-sm">{t('resourceTypeLabel')}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button">
                    <HelpCircle className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="text-sm">
                  <p>{t('resourceTypeInfo')}</p>
                </PopoverContent>
              </Popover>
            </div>
            <RadioGroup
              {...field}
              className="mb-2"
              onValueChange={field.onChange}
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
                    value={ResourceType.CUSTOM}
                    id="custom-radio"
                  />
                  <Label>{ResourceType.CUSTOM}</Label>
                </div>
              </div>
            </RadioGroup>
          </FormItem>
        )}
      />
    </div>
  );
}
