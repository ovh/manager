import { useEffect } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { OdsQuantity } from '@ovhcloud/ods-components/react';
import {
  Alert,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
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
  const { control, setError, clearErrors } = useFormContext<
    ScalingStrategySchema
  >();
  const scaleDownValue = useWatch({
    control,
    name: 'scaleDownStabilizationWindowSeconds',
  });
  const scaleUpValue = useWatch({
    control,
    name: 'scaleUpStabilizationWindowSeconds',
  });
  const scaleToZeroValue = useWatch({
    control,
    name: 'cooldownPeriodSeconds',
  });

  useEffect(() => {
    const validateRange = (
      name:
        | 'cooldownPeriodSeconds'
        | 'scaleDownStabilizationWindowSeconds'
        | 'scaleUpStabilizationWindowSeconds',
      value: number | undefined,
      min: number,
      max: number | undefined,
      errorKey: 'scaleDelayRangeError' | 'scaleToZeroDelayRangeError',
    ) => {
      if (value == null || Number.isNaN(value)) {
        clearErrors(name);
        return;
      }
      const hasMinError = value < min;
      const hasMaxError = max !== undefined && value > max;

      if (hasMinError || hasMaxError) {
        setError(name, {
          type: 'manual',
          message: t(errorKey),
        });
      } else {
        clearErrors(name);
      }
    };

    validateRange(
      'scaleDownStabilizationWindowSeconds',
      scaleDownValue,
      0,
      3600,
      'scaleDelayRangeError',
    );
    validateRange(
      'scaleUpStabilizationWindowSeconds',
      scaleUpValue,
      0,
      3600,
      'scaleDelayRangeError',
    );
    validateRange(
      'cooldownPeriodSeconds',
      scaleToZeroValue,
      60,
      undefined,
      'scaleToZeroDelayRangeError',
    );
  }, [
    scaleDownValue,
    scaleUpValue,
    scaleToZeroValue,
    setError,
    clearErrors,
    t,
  ]);

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
              name="cooldownPeriodSeconds"
              render={({ field, fieldState }) => (
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
                    <OdsQuantity
                      ariaLabel={t('scaleToZeroInputLabel')}
                      data-testid="scale-to-zero-input"
                      hasError={!!fieldState.error}
                      min={60}
                      name={field.name}
                      onOdsBlur={field.onBlur}
                      onOdsChange={(event) =>
                        field.onChange(event.detail.value ?? undefined)
                      }
                      step={1}
                      value={field.value ?? null}
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
            name="scaleDownStabilizationWindowSeconds"
            render={({ field, fieldState }) => (
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
                  <OdsQuantity
                    ariaLabel={t('scaleDownDelayInputLabel')}
                    data-testid="scale-down-delay-input"
                    hasError={!!fieldState.error}
                    max={3600}
                    min={0}
                    name={field.name}
                    onOdsBlur={field.onBlur}
                    onOdsChange={(event) =>
                      field.onChange(event.detail.value ?? undefined)
                    }
                    step={1}
                    value={field.value ?? null}
                  />
                </FormControl>
                {fieldState.error?.message && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
        <div className="w-full">
          <FormField
            control={control}
            name="scaleUpStabilizationWindowSeconds"
            render={({ field, fieldState }) => (
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
                  <OdsQuantity
                    ariaLabel={t('scaleUpDelayInputLabel')}
                    data-testid="scale-up-delay-input"
                    hasError={!!fieldState.error}
                    max={3600}
                    min={0}
                    name={field.name}
                    onOdsBlur={field.onBlur}
                    onOdsChange={(event) =>
                      field.onChange(event.detail.value ?? undefined)
                    }
                    step={1}
                    value={field.value ?? null}
                  />
                </FormControl>
                {fieldState.error?.message && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
