import { useQuery } from '@tanstack/react-query';
import { cdbApi } from '@/data/cdbapi';
import { database } from '@/models/database';
import { Progress } from '@/components/ui/progress';

interface MeterProps {
  projectId: string;
  service: database.Service;
  metric: string;
}

const ServiceMeter = ({ service, projectId, metric }: MeterProps) => {
  const metricQuery = useQuery({
    queryKey: ['/metric', projectId, metric, service.engine, service.id],
    queryFn: () =>
      cdbApi.getMetric(
        projectId,
        service.engine,
        service.id,
        metric,
        database.service.MetricPeriodEnum.lastHour,
      ),
    refetchInterval: 30_000, // poll service every 30 sec
  });
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
