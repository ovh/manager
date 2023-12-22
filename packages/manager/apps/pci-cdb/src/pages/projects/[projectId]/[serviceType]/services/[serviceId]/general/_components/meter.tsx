import { database } from '@/models/database';
import { Progress } from '@/components/ui/progress';
import { useGetMetric } from '@/hooks/api/useGetMetric';

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
      <b>{metric}</b>
      {metricQuery.data ? (
        metricQuery.data.metrics.map((m) => {
          const { value } = m.dataPoints[m.dataPoints.length - 1];
          return (
            <div className="flex" key={m.hostname}>
              <p>
                {m.hostname.split('-')[0]}: {value.toFixed(2)}%{' '}
              </p>
              <Progress value={value} />
            </div>
          );
        })
      ) : (
        <p>{metricQuery.status}</p>
      )}
    </>
  );
};

export default ServiceMeter;
