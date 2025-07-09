import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import {
  Button,
  Label,
  Switch,
  Card,
  CardContent,
  CardHeader,
  Separator,
} from '@datatr-ux/uxlib';
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
import MetricTitle from './_components/MetricTitle.component';

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
  const metricPeriods = [
    database.service.MetricPeriodEnum.lastHour,
    database.service.MetricPeriodEnum.lastDay,
    database.service.MetricPeriodEnum.lastWeek,
    database.service.MetricPeriodEnum.lastMonth,
    database.service.MetricPeriodEnum.lastYear,
  ];
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
      <Separator className="!my-5" />
      {metricsQuery.isSuccess ? (
        <>
          <div className="flex w-full justify-between mb-2">
            <div className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]">
              {metricPeriods.map((periodValue) => (
                <button
                  data-state={period === periodValue ? 'active' : 'inactive'}
                  data-testid="manage-period-button"
                  key={periodValue}
                  onClick={() => setPeriod(periodValue)}
                  className="data-[state=active]:bg-primary dark:data-[state=active]:text-white focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                >
                  {t(`interval-${periodValue}`)}
                </button>
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
                <CardHeader>
                  <h5>
                    <MetricTitle metric={metric} />
                  </h5>
                </CardHeader>
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
