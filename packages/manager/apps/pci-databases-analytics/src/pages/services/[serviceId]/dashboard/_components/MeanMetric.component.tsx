import { Skeleton } from '@/components/ui/skeleton';
import { useMeanMetric } from '@/hooks/useMeanMetric';
import { cn } from '@/lib/utils';
import { useServiceData } from '../../Service.context';

interface MeanMetricProps {
  value?: number;
  thresholdOrange?: number;
  thresholdRed?: number;
  metricName: string;
  fn?: (value: number) => number;
}
const MeanMetric = ({
  metricName,
  fn = (value) => value,
  thresholdOrange = 60,
  thresholdRed = 80,
}: MeanMetricProps) => {
  const { service, projectId } = useServiceData();
  const value = useMeanMetric({
    projectId,
    engine: service.engine,
    serviceId: service.id,
    metric: metricName,
    fn,
  });
  return (
    <div
      className={cn(
        'text-2xl font-bold w-full flex align-middle justify-center',
        value && 'text-green-500',
        value && value > thresholdOrange && 'text-orange-500',
        value && value > thresholdRed && 'text-red-500',
      )}
    >
      {value ? (
        `${value.toFixed(2)}%`
      ) : (
        <Skeleton
          data-testid="mean-metric-skeleton"
          className="h-4 w-16 inline ml-2"
        />
      )}
    </div>
  );
};

export default MeanMetric;
