import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Button, Label, Switch, Card, CardContent } from '@datatr-ux/uxlib';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useServiceData } from '../Service.context';
import * as database from '@/types/cloud/project/database';
import MetricChart from './_components/MetricChart.component';
import { cn } from '@/lib/utils';
import { POLLING } from '@/configuration/polling.constants';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';
import PrometheusConfigTile from './prometheus/PrometheusConfigTile.component';

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
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.metrics} engine={service.engine} />
      </div>
      <p>{t('description')}</p>
      {service.capabilities.prometheus?.read ===
        database.service.capability.StateEnum.enabled && (
        <PrometheusConfigTile />
      )}
      {metricsQuery.isSuccess ? (
        <>
          <div className="flex w-full justify-between mb-2">
            <div className="flex">
              {metricPeriods.map((periodValue, index) => (
                <Button
                  data-testid="manage-period-button"
                  mode={period === periodValue ? 'default' : 'outline'}
                  key={periodValue}
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
            <div
              data-testid="swith-auto-refresh-container"
              className="flex items-center space-x-2 mb-2"
            >
              <Switch
                className="rounded-xl"
                id="poll-metrics"
                checked={poll}
                onCheckedChange={(checked) => setPoll(checked)}
              />
              <Label htmlFor="poll-metrics">{t('autoRefreshInputLabel')}</Label>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {metricsQuery.data.map((metric) => (
              <Card key={metric}>
                <CardContent>
                  <MetricChart
                    metric={metric}
                    period={period}
                    poll={poll}
                    pollInterval={POLLING.METRICS}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <p>Loading</p>
      )}
      <Outlet />
    </>
  );
};

export default Metrics;
