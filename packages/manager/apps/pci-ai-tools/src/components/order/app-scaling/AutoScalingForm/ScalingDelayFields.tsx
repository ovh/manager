import { AlertCircle, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  Alert,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import { ScalingStrategySchema } from '../scalingHelper';

interface ScalingDelayFieldsProps {
  showScaleToZero: boolean;
}

export function ScalingDelayFields({
  showScaleToZero,
}: ScalingDelayFieldsProps) {
  const { t } = useTranslation('ai-tools/components/scaling');
  const { control } = useFormContext<ScalingStrategySchema>();

  return (
    <div className="flex flex-col gap-4">
      {showScaleToZero && (
        <Alert variant="primary" className="border-0">
          <div className="flex flex-row gap-3 items-start">
            <AlertCircle className="size-5 mt-0.5 shrink-0" />
            <p>{t('scaleToZeroWarningTraffic')}</p>
          </div>
        </Alert>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6">
        {showScaleToZero && (
          <div className="w-full">
            <FormField
              control={control}
              name="cooldownPeriodSeconds"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm">{t('scaleToZeroInputLabel')}</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button">
                          <HelpCircle className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        <p>{t('scaleToZeroInputInfo')}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input
                      data-testid="scale-to-zero-input"
                      {...field}
                      type="number"
                      min={0}
                      step={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="w-full">
          <FormField
            control={control}
            name="scaleUpStabilizationWindowSeconds"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-sm">{t('scaleUpDelayInputLabel')}</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button">
                        <HelpCircle className="size-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>{t('scaleUpDelayInputInfo')}</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl>
                  <Input
                    data-testid="scale-up-delay-input"
                    {...field}
                    type="number"
                    min={0}
                    step={1}
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
            name="scaleDownStabilizationWindowSeconds"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-sm">{t('scaleDownDelayInputLabel')}</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button">
                        <HelpCircle className="size-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>{t('scaleDownDelayInputInfo')}</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl>
                  <Input
                    data-testid="scale-down-delay-input"
                    {...field}
                    type="number"
                    min={0}
                    step={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
