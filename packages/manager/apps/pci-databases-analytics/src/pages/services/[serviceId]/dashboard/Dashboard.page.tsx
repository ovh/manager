import {
  AlertCircle,
  ArrowRight,
  Cpu,
  Files,
  Globe2,
  HardDrive,
  MemoryStick,
  ShieldCheck,
  TrafficCone,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useServiceData } from '../Service.context';
import MetricChart from '../metrics/_components/MetricChart.component';
import * as database from '@/types/cloud/project/database';
import { POLLING } from '@/configuration/polling.constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ConnectionDetails from './_components/ConnectionDetails.component';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Maintenance from './_components/Maintenance.component';
import Link from '@/components/links/Link.component';
import OvhLink from '@/components/links/OvhLink.component';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { useGetVrack } from '@/hooks/api/network/useGetVrack.hook';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';

interface MetricTile {
  name: string;
  icon: JSX.Element;
  title: string;
}
const Dashboard = () => {
  const { service, projectId } = useServiceData();
  const vrackQuery = useGetVrack(projectId);
  const metricsQuery = useGetMetrics(projectId, service.engine, service.id);
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/dashboard',
  );

  const metricsToDispplay: MetricTile[] = useMemo(
    () =>
      metricsQuery.isSuccess
        ? [
            ...(service.storage?.size.value > 0 &&
            metricsQuery.data.includes('disk_usage_percent')
              ? [
                  {
                    name: 'disk_usage_percent',
                    icon: <HardDrive className="size-4 inline mr-2" />,
                    title: 'storageChartTitle',
                  },
                ]
              : []),
            ...(metricsQuery.data.includes('cpu_usage_percent')
              ? [
                  {
                    name: 'cpu_usage_percent',
                    icon: <Cpu className="size-4 inline mr-2" />,
                    title: 'cpuChartTitle',
                  },
                ]
              : []),
            ...(metricsQuery.data.includes('mem_usage_percent')
              ? [
                  {
                    name: 'mem_usage_percent',
                    icon: <MemoryStick className="size-4 inline mr-2" />,
                    title: 'ramChartTitle',
                  },
                ]
              : []),
            ...(metricsQuery.data.includes('cpu_usage')
              ? [
                  {
                    name: 'mem_usage',
                    icon: <MemoryStick className="size-4 inline mr-2" />,
                    title: 'ramChartTitle',
                  },
                ]
              : []),
          ]
        : [],
    [metricsQuery.data],
  );
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.dashboard} engine={service.engine} />
      </div>
      <Alert variant="info">
        <AlertDescription className="text-base">
          <div className="flex flex-col items-stretch  md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-row gap-5 items-center">
              <AlertCircle className="h-6 w-6" />
              <p>{t('upgradeAlertDescription')}</p>
            </div>
            <Button
              data-testid="dashboard-upgrade-button"
              variant="default"
              type="button"
              asChild
            >
              <Link
                className="hover:no-underline hover:text-primary-foreground"
                to={'settings#update'}
              >
                {t('upgradeButton')}
                <ArrowRight className="w-4 h-4 ml-2 mt-1" />
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <div
        data-testid="dashboard-metrics-container"
        className="flex flex-col lg:grid lg:grid-flow-col lg:auto-cols-fr gap-2"
      >
        {metricsQuery.isSuccess ? (
          metricsToDispplay.map((metric) => (
            <Card
              data-testid={`dashboard-metrics-card-${metric.name}`}
              key={metric.name}
            >
              <CardHeader>
                <h5>
                  {metric.icon}
                  <span>{t(metric.title)}</span>
                </h5>
              </CardHeader>
              <CardContent>
                <MetricChart
                  metric={metric.name}
                  period={database.service.MetricPeriodEnum.lastDay}
                  poll={false}
                  pollInterval={POLLING.METRICS}
                  className="aspect-auto sm:h-[200px]"
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <div data-testid="dashboard-metrics-skeleton">
            <Skeleton className="w-full h-[200px]" />
            <Skeleton className="w-full h-[200px]" />
            <Skeleton className="w-full h-[200px]" />
          </div>
        )}
      </div>
      <div className="flex flex-col lg:grid lg:grid-flow-col lg:auto-cols-fr gap-2">
        {service.endpoints.length > 0 && (
          <Card>
            <CardHeader>
              <h5>
                <Globe2 className="size-4 inline mr-2" />
                <span>{t('connectionDetailsTitle')}</span>
              </h5>
            </CardHeader>
            <CardContent>
              <ConnectionDetails endpoints={service.endpoints} />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <h5>
              <TrafficCone className="size-4 inline mr-2 text-amber-600" />
              <span>{t('maintenanceTitle')}</span>
            </h5>
          </CardHeader>
          <CardContent>
            <Maintenance />
            {service.networkType === database.NetworkTypeEnum.private &&
              vrackQuery.isSuccess && (
                <div data-testid="dashboard-vrack-container">
                  <h5 className="py-6">
                    <ShieldCheck className="size-4 inline mr-2 text-green-500" />
                    {t('networkTitle')}
                  </h5>
                  <div className="flex flex-row gap-1">
                    <OvhLink
                      application="dedicated"
                      path={`#/vrack/${vrackQuery.data.id}`}
                    >
                      {t('networkLink', {
                        vrack: vrackQuery.data.id,
                      })}
                    </OvhLink>
                    <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h5>
              <UserCheck className="size-4 inline mr-2" />
              <span>{t('priceBillingTitle')}</span>
            </h5>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-base mr-2">
              <div className="flex flex-row gap-2">
                <p className="font-semibold">{t('serviceIdLabel')}</p>
                <p>{service.id}</p>
              </div>
              <Button
                data-testid="dashboard-copy-id-button"
                type="button"
                size="table"
                variant="table"
                onClick={() => {
                  navigator.clipboard.writeText(service.id);
                  toast.toast({
                    title: t('serviceIdCopyToast'),
                  });
                }}
              >
                <Files className="w-4 h-4" />
              </Button>
            </div>
            <div
              data-testid="dashboard-billing-link"
              className="flex flex-row gap-1 mt-3"
            >
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/billing`}
              >
                {t('billingLink')}
              </OvhLink>
              <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
            </div>
            <div
              data-testid="dashboard-support-link"
              className="flex flex-row gap-1 mt-2"
            >
              <OvhLink application="dedicated" path={`#/support/tickets/new`}>
                {t('supportLink')}
              </OvhLink>
              <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
