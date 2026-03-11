import { Control, FieldValues } from 'react-hook-form';

import { ScalingStrategySchema } from '../scalingHelper';
import { ReplicaFields } from './ReplicaFields';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { CpuRamFields } from './CpuRamFields';
import { CustomMetricsFields } from './CustomMetricsFields';
import { ScalingDelayFields } from './ScalingDelayFields';

interface AutoScalingFormProps<
  TFieldValues extends FieldValues & ScalingStrategySchema,
> {
  averageUsageTarget: number;
  control: Control<TFieldValues>;
  isCustom: boolean;
  syncReplicasMaxFromMin?: (replicasMinValue?: unknown) => void;
  showScaleToZero: boolean;
}

export function AutoScalingForm<
  TFieldValues extends FieldValues & ScalingStrategySchema,
>({
  averageUsageTarget,
  control,
  isCustom,
  syncReplicasMaxFromMin,
  showScaleToZero,
}: AutoScalingFormProps<TFieldValues>) {
  return (
    <div data-testid="auto-scaling-container" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <ReplicaFields
          control={control}
          showScaleToZeroWarning={showScaleToZero}
          syncReplicasMaxFromMin={syncReplicasMaxFromMin}
        />
      </div>
      <div className="flex flex-col gap-4">
        <ResourceTypeSelector control={control} />
        {!isCustom && (
          <CpuRamFields control={control} averageUsageTarget={averageUsageTarget} />
        )}
        {isCustom && <CustomMetricsFields control={control} />}
      </div>
      <ScalingDelayFields
        control={control}
        showScaleToZero={showScaleToZero}
      />
    </div>
  );
}
