import { AlertCircle, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  Alert,
  FormControl,
  FormField,
  FormItem,
  Input,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import {
  ScalingStrategySchema,
} from '../scalingHelper';

interface ScalingDelayFieldsProps<
  TFieldValues extends FieldValues & ScalingStrategySchema,
> {
  control: Control<TFieldValues>;
  showScaleToZero: boolean;
}

export function ScalingDelayFields<
  TFieldValues extends FieldValues & ScalingStrategySchema,
>({
  control,
  showScaleToZero,
}: ScalingDelayFieldsProps<TFieldValues>) {
  const { t } = useTranslation('ai-tools/components/scaling');

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold">{t('scaleWindowSectionTitle')}</p>
      {showScaleToZero && (
        <Alert variant="primary" className="border-0">
          <div className="flex flex-row gap-3 items-start">
            <AlertCircle className="size-5 mt-0.5 shrink-0" />
            <p>{t('scaleToZeroWarningTraffic')}</p>
          </div>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {showScaleToZero && (
          <div className="w-full md:col-span-2">
            <FormField
              control={control}
              name={'cooldownPeriodSeconds' as FieldPath<TFieldValues>}
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
                      step={1}
                      type="number"
                      {...field}
                      value={field.value ?? ''}
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
            name={
              'scaleDownStabilizationWindowSeconds' as FieldPath<TFieldValues>
            }
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2 min-h-6">
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
                    step={1}
                    type="number"
                    {...field}
                    value={field.value ?? ''}
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
            name={
              'scaleUpStabilizationWindowSeconds' as FieldPath<TFieldValues>
            }
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2 min-h-6">
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
                    step={1}
                    type="number"
                    {...field}
                    value={field.value ?? ''}
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
