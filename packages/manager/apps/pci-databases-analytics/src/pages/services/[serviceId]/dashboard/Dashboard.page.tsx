import {
  AlertCircle,
  ArrowRight,
  Cpu,
  Globe2,
  HardDrive,
  MemoryStick,
  ShieldAlert,
  ShieldCheck,
  TrafficCone,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  AlertDescription,
  Skeleton,
  Clipboard,
} from '@datatr-ux/uxlib';
import { useServiceData } from '../Service.context';
import MetricChart from '../metrics/_components/MetricChart.component';
import * as database from '@/types/cloud/project/database';
import { POLLING } from '@/configuration/polling.constants';
import ConnectionDetails from './_components/ConnectionDetails.component';
import Maintenance from './_components/Maintenance.component';
import Link from '@/components/links/Link.component';
import OvhLink from '@/components/links/OvhLink.component';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { useGetVrack } from '@/hooks/api/network/useGetVrack.hook';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';
import { useGetServiceSubnet } from '@/hooks/api/network/useGetServiceSubnet.hook';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import A from '@/components/links/A.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';

interface MetricTile {
  name: string;
  icon: JSX.Element;
  title: string;
}
const Dashboard = () => {
  const { service, projectId } = useServiceData();
  const vrackQuery = useGetVrack(projectId);
  const track = useTrackAction();
  const subnet = useGetServiceSubnet(projectId, service);
  const metricsQuery = useGetMetrics(projectId, service.engine, service.id);
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/dashboard',
  );
  const supportLink = 'https://help.ovhcloud.com/csm?id=csm_get_help';
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
        <div className="flex flex-wrap justify-end gap-1">
          <RoadmapChangelog />
          <Guides section={GuideSections.dashboard} engine={service.engine} />
        </div>
      </div>
      <Alert variant="information" className="rounded-md">
        <AlertDescription className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center gap-2">
            <AlertCircle className="size-6" />
            <p>{t('upgradeAlertDescription')}</p>
          </div>
          <Button
            data-testid="dashboard-upgrade-button"
            className="whitespace-nowrap"
            type="button"
            asChild
          >
            <Link
              onClick={() => track(TRACKING.dashboard.upgradeOfferClick())}
              className="flex items-center hover:no-underline hover:text-primary-foreground"
              to={'settings#update'}
            >
              {t('upgradeButton')}
              <ArrowRight className="w-4 h-4 ml-2 mt-1" />
            </Link>
          </Button>
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
            <div data-testid="dashboard-vrack-container">
              {service.networkType === database.NetworkTypeEnum.private && (
                <div>
                  <h5 className="py-6">
                    <ShieldCheck className="size-4 inline mr-2 text-green-500" />
                    {t('networkTitle')}
                  </h5>
                  {vrackQuery.isSuccess ? (
                    <OvhLink
                      application="dedicated"
                      path={`#/vrack/${vrackQuery.data.id}`}
                    >
                      <div className="flex flex-row gap-1">
                        {t('networkLink', {
                          vrack: vrackQuery.data.id,
                        })}
                        <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
                      </div>
                    </OvhLink>
                  ) : (
                    <Skeleton className="w-28 h-4" />
                  )}

                  <div className="flex flex-row gap-1 items-center">
                    <b>{t('subnetTitle')}</b>
                    {subnet ? (
                      <span>
                        {`${subnet.cidr} - ${subnet.ipPools[0]?.region}`}
                      </span>
                    ) : (
                      <Skeleton className="w-28 h-4" />
                    )}
                  </div>
                </div>
              )}
              {service.networkType === database.NetworkTypeEnum.public && (
                <h5 className="py-6">
                  <ShieldAlert className="size-4 inline mr-2 text-amber-400" />
                  {t('networkPublicTitle')}
                </h5>
              )}
            </div>
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
            <div>
              <p className="font-semibold">{t('serviceIdLabel')}</p>
              <Clipboard
                value={service.id}
                data-testid="dashboard-copy-id-button"
              />
            </div>
            <div
              data-testid="dashboard-support-link"
              className="flex flex-row gap-1 mt-2"
            >
              <A href={supportLink} target="_blank" rel="noopener noreferrer">
                <div className="inline-flex items-center gap-2">
                  <span>{t('supportLink')}</span>
                  <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
                </div>
              </A>
            </div>
            <div
              data-testid="dashboard-billing-link"
              className="flex flex-row gap-1 mt-2"
            >
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/billing`}
              >
                {t('billingLink')}
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
