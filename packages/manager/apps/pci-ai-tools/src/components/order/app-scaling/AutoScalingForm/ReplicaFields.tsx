import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  Alert,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from '@datatr-ux/uxlib';
import { ScalingStrategySchema } from '../scalingHelper';

interface ReplicaFieldsProps<
  TFieldValues extends FieldValues & ScalingStrategySchema,
> {
  control: Control<TFieldValues>;
  showScaleToZeroWarning: boolean;
  syncReplicasMaxFromMin?: (replicasMinValue?: unknown) => void;
}

export function ReplicaFields<
  TFieldValues extends FieldValues & ScalingStrategySchema,
>({
  control,
  showScaleToZeroWarning,
  syncReplicasMaxFromMin,
}: ReplicaFieldsProps<TFieldValues>) {
  const { t } = useTranslation('ai-tools/components/scaling');

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
            name={'replicasMin' as FieldPath<TFieldValues>}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2 min-h-6">
                  <p className="text-sm">{t('replicasMinInputLabel')}</p>
                </div>
                <FormControl>
                  <Input
                    data-testid="min-rep-input"
                    step={1}
                    type="number"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(event) => {
                      field.onChange(event);
                      syncReplicasMaxFromMin?.();
                    }}
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
            name={'replicasMax' as FieldPath<TFieldValues>}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2 min-h-6">
                  <p className="text-sm">{t('replicasMaxInputLabel')}</p>
                </div>
                <FormControl>
                  <Input
                    data-testid="max-rep-input"
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
