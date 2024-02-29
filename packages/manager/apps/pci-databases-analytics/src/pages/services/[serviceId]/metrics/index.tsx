import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import { H2, P } from '@/components/typography';
import { useServiceData } from '../layout';
import { database } from '@/models/database';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import MetricChart from './_components/metricChart';
import { useGetMetrics } from '@/hooks/api/metrics.api.hooks';
import { cn } from '@/lib/utils';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/metrics"
    />
  );
}

const Metrics = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics',
  );
  const [poll, setPoll] = useState(false);
  const { projectId, service } = useServiceData();
  const metricsQuery = useGetMetrics(projectId, service.engine, service.id);
  const [period, setPeriod] = useState<database.service.MetricPeriodEnum>(
    database.service.MetricPeriodEnum.lastHour,
  );
  const metricPeriods = Object.values(database.service.MetricPeriodEnum);

  return (
    <>
      <H2 className="mb-2">{t('title')}</H2>
      <P className="mb-2">{t('description')}</P>
      {metricsQuery.isSuccess ? (
        <>
          <div className="flex w-full justify-between mb-2">
            <div className="flex">
              {metricPeriods.map((periodValue, index) => (
                <Button
                  variant={period === periodValue ? 'default' : 'outline'}
                  key={index}
                  onClick={() => setPeriod(periodValue)}
                  size={'sm'}
                  className={cn('rounded-none border-r-0', {
                    'rounded-l-md': index === 0,
                    'rounded-r-md border-r-2':
                      index === metricPeriods.length - 1,
                  })}
                >
                  {t(`interval-${periodValue}`)}
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
              <Label htmlFor="poll-metrics">{t('autoRefreshInputLabel')}</Label>
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
        <P>Loading</P>
      )}
    </>
  );
};

export default Metrics;
