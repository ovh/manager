import { useState } from 'react';
import { H2, P } from '@/components/typography';
import { useGetMetrics } from '@/hooks/api/metrics.api.hooks';
import { useServiceData } from '../serviceData.hook';
import MetricChart from './_components/metricChart';
import { Button } from '@/components/ui/button';
import { database } from '@/models/database';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const Handle = {
  breadcrumb: () => 'Metrics',
};

const MetricsPage = () => {
  const [poll, setPoll] = useState(true);
  const { projectId, service } = useServiceData();
  const metricsQuery = useGetMetrics(projectId, service.engine, service.id);
  const [period, setPeriod] = useState<database.service.MetricPeriodEnum>(
    database.service.MetricPeriodEnum.lastHour,
  );
  const metricPeriods = Object.values(database.service.MetricPeriodEnum);

  return (
    <>
      <H2>Metrics</H2>
      <P>
        To help you track and manage your database instance, view its main
        metrics and statistics below. Their retention period depends on your
        service solution.
      </P>

      {metricsQuery.isSuccess ? (
        <>
          <div className="flex w-full justify-between mb-2">
            <div className="flex gap-2">
              {metricPeriods.map((periodValue, index) => (
                <Button
                  variant={period === periodValue ? 'default' : 'outline'}
                  key={index}
                  onClick={() => setPeriod(periodValue)}
                  size={'sm'}
                >
                  {periodValue}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Switch
                className="rounded-xl"
                id="poll-metrics"
                checked={poll}
                onCheckedChange={(checked) => setPoll(checked)}
              />
              <Label htmlFor="poll-metrics">Auto-refresh</Label>
            </div>
          </div>
          {metricsQuery.data.map((metric, index) => (
            <MetricChart
              key={index}
              metric={metric}
              period={period}
              poll={poll}
              pollInterval={30_000}
            />
          ))}
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default MetricsPage;
