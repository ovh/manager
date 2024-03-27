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
import { useServiceData } from '../layout';
import MetricChart from '../metrics/_components/metricChart';
import { database } from '@/models/database';
import { POLLING } from '@/configuration/polling';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ConnectionDetails from './_components/connectionDetails';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Maintenance from './_components/maintenance';
import { Link, OvhLink } from '@/components/links';
import { useGetCapabilities } from '@/hooks/api/availabilities.api.hooks';
import MeanMetric from './_components/meanMetric';
import { useGetVrack } from '@/hooks/api/vrack.api.hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard = () => {
  const { service, projectId } = useServiceData();
  const vrackQuery = useGetVrack(projectId);
  const capabilitiesQuery = useGetCapabilities(projectId, {
    enabled: service.engine === database.EngineEnum.mongodb,
  });
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/dashboard',
  );

  return (
    <>
      <h2>{t('title')}</h2>

      {service.engine === database.EngineEnum.postgresql && (
        <Alert variant="warning">
          <AlertDescription className="mt-2 text-base">
            <div className="flex flex-row items-center justify-between mr-8">
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6" />
                <p>{t('upgradeAlertDescription')}</p>
              </div>
              <Button variant="default" type="button" asChild>
                <Link
                  className="hover:no-underline hover:text-primary-foreground"
                  to={'settings/update?target=flavor'}
                >
                  {t('upgradeButton')}
                  <ArrowRight className="w-4 h-4 ml-2 mt-1" />
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2">
        {service.storage?.size.value > 0 && (
          <Card>
            <CardHeader>
              <h5>
                <HardDrive className="size-4 inline mr-2" />
                <span>{t('storageChartTitle')}</span>
              </h5>
            </CardHeader>
            <CardContent>
              <MetricChart
                metric={'disk_usage_percent'}
                period={database.service.MetricPeriodEnum.lastDay}
                poll={false}
                pollInterval={POLLING.METRICS}
                className="aspect-auto sm:h-[200px]"
              />
              <MeanMetric metricName={'disk_usage_percent'} />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <h5>
              <Cpu className="size-4 inline mr-2" />
              <span>{t('cpuChartTitle')}</span>
            </h5>
          </CardHeader>
          <CardContent>
            <MetricChart
              metric={'cpu_usage_percent'}
              period={database.service.MetricPeriodEnum.lastDay}
              poll={false}
              pollInterval={POLLING.METRICS}
              className="aspect-auto sm:h-[200px]"
            />
            <MeanMetric metricName={'cpu_usage_percent'} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h5>
              <MemoryStick className="size-4 inline mr-2" />
              <span>{t('ramChartTitle')}</span>
            </h5>
          </CardHeader>
          <CardContent>
            {service.engine === database.EngineEnum.mongodb ? (
              <>
                <MetricChart
                  metric={'mem_usage'}
                  period={database.service.MetricPeriodEnum.lastDay}
                  poll={false}
                  pollInterval={POLLING.METRICS}
                  className="aspect-auto sm:h-[200px]"
                />
                {capabilitiesQuery.isSuccess && (
                  <MeanMetric
                    metricName={'mem_usage'}
                    fn={(val) =>
                      (val * 100) /
                      (capabilitiesQuery.data?.flavors.find(
                        (f) => f.name === service.flavor,
                      ).specifications.memory.value *
                        1000)
                    }
                  />
                )}
              </>
            ) : (
              <>
                <MetricChart
                  metric={'mem_usage_percent'}
                  period={database.service.MetricPeriodEnum.lastDay}
                  poll={false}
                  pollInterval={POLLING.METRICS}
                  className="aspect-auto sm:h-[200px]"
                />
                <MeanMetric metricName={'mem_usage_percent'} />
              </>
            )}
          </CardContent>
        </Card>
        {service.endpoints.length > 0 && (
          <Card className="col-start-1">
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
                <div>
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
            <div className="flex flex-row gap-1 mt-3">
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/billing`}
              >
                {t('billingLink')}
              </OvhLink>
              <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
            </div>
            <div className="flex flex-row gap-1 mt-3">
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
