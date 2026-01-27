import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { OdsQuantity } from '@ovhcloud/ods-components/react';
import {
  Alert,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@datatr-ux/uxlib';
import { ScalingStrategySchema } from '../scalingHelper';

export function ReplicaFields() {
  const { t } = useTranslation('ai-tools/components/scaling');
  const { control, setValue } = useFormContext<ScalingStrategySchema>();
  const minReplicas = useWatch({ control, name: 'replicasMin' });
  const maxReplicas = useWatch({ control, name: 'replicasMax' });
  const showScaleToZeroWarning = Number(minReplicas) === 0;
  const minReplicasValue = Number(minReplicas);
  const maxReplicasValue = Number(maxReplicas);
  const minMaxReplicas = Number.isFinite(minReplicasValue)
    ? Math.max(1, minReplicasValue)
    : 1;

  useEffect(() => {
    if (!Number.isFinite(maxReplicasValue)) {
      return;
    }
    if (maxReplicasValue < minMaxReplicas) {
      setValue('replicasMax', minMaxReplicas, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [maxReplicasValue, minMaxReplicas, setValue]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold">{t('replicasSectionTitle')}</p>
      {showScaleToZeroWarning && (
        <Alert variant="warning" className="border-0">
          <div className="flex flex-row gap-3 items-start">
            <AlertCircle className="size-5 mt-0.5 shrink-0" />
            <p>{t('scaleToZeroWarningFlavor')}</p>
          </div>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="w-full">
          <FormField
            control={control}
            name="replicasMin"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2 min-h-6">
                  <p className="text-sm">{t('replicasMinInputLabel')}</p>
                </div>
                <FormControl>
                  <OdsQuantity
                    ariaLabel={t('replicasMinInputLabel')}
                    data-testid="min-rep-input"
                    hasError={!!fieldState.error}
                    max={10}
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full">
          <FormField
            control={control}
            name="replicasMax"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2 min-h-6">
                  <p className="text-sm">{t('replicasMaxInputLabel')}</p>
                </div>
                <FormControl>
                  <OdsQuantity
                    ariaLabel={t('replicasMaxInputLabel')}
                    data-testid="max-rep-input"
                    hasError={!!fieldState.error}
                    max={10}
                    min={minMaxReplicas}
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
      </div>
    </div>
  );
}
