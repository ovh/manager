import { database } from '@/models/database';
import { Progress } from '@/components/ui/progress';
import { useGetMetric } from '@/hooks/api/useGetMetric';
import { Skeleton } from '@/components/ui/skeleton';

interface MeterProps {
  projectId: string;
  service: database.Service;
  metric: string;
}

const ServiceMeter = ({ service, projectId, metric }: MeterProps) => {
  const metricQuery = useGetMetric(
    projectId,
    service.engine,
    service.id,
    metric,
    database.service.MetricPeriodEnum.lastHour,
    { refetchInterval: 30_000 },
  );
  return (
    <>
      <b className="mb-2">{metric}</b>
      {metricQuery.data ? (
        metricQuery.data.metrics.map((m) => {
          const { value } = m.dataPoints[m.dataPoints.length - 1];
          return (
            <div className="flex gap-2 items-center" key={m.hostname}>
              <p className="whitespace-nowrap">
                {m.hostname.split('-')[0]}: {value.toFixed(2)}%{' '}
              </p>
              <Progress value={value} />
            </div>
          );
        })
      ) : (
        <ServiceMeter.Skeleton />
      )}
    </>
  );
};

ServiceMeter.Skeleton = function ServicesMeterSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-56 h-4" />
      <Skeleton className="w-20 h-4" />
    </div>
  );
};

export default ServiceMeter;
