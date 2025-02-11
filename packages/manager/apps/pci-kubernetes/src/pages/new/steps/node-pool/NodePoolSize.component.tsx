import {
  Autoscaling,
  AutoscalingState,
} from '@/components/Autoscaling.component';

export interface NodeSizeStepProps {
  isMonthlyBilled: boolean;
  antiAffinity: boolean;
  onScaleChange: (scaling: AutoscalingState) => void;
}

export default function NodePoolSize({
  onScaleChange,
  isMonthlyBilled,
  antiAffinity,
}: Readonly<NodeSizeStepProps>) {
  return (
    <div className="mb-8">
      <Autoscaling
        autoscale={false}
        isAntiAffinity={antiAffinity}
        onChange={onScaleChange}
        isMonthlyBilling={isMonthlyBilled}
      />
    </div>
  );
}
