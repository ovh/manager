import {
  ArrowRight,
  Cpu,
  Files,
  Globe2,
  HardDrive,
  MemoryStick,
  TrafficCone,
  UserCheck,
} from 'lucide-react';
import { useServiceData } from '../layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import MetricChart from '../metrics/_components/metricChart';
import { database } from '@/models/database';
import { POLLING } from '@/configuration/polling';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ConnectionDetails from './_components/connectionDetails';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Maintenance from './_components/maintenance';
import { OvhLink } from '@/components/links';
import { useGetCapabilities } from '@/hooks/api/availabilities.api.hooks';
import MeanMetric from './_components/meanMetric';

const Dashboard = () => {
  const { service, projectId } = useServiceData();
  const capabilitiesQuery = useGetCapabilities(projectId, {
    enabled: service.engine === database.EngineEnum.mongodb,
  });
  const toast = useToast();
  return (
    <>
      <h2>dashboard</h2>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2">
        {service.storage?.size.value > 0 && (
          <Card>
            <CardHeader>
              <h5>
                <HardDrive className="size-4 inline mr-2" />
                <span>Storage</span>
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
              <span>CPU</span>
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
              <span>Memory</span>
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
                <span>Informations de connection</span>
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
              <span>Maintenance</span>
            </h5>
          </CardHeader>
          <CardContent>
            <Maintenance />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h5>
              <UserCheck className="size-4 inline mr-2" />
              <span>Support & Billing</span>
            </h5>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row gap-2 text-base">
              <p className="font-semibold">Id du service</p>
              <p>{service.id}</p>
              <Button
                type="button"
                size="table"
                variant="ghost"
                className="ml-2 hover:bg-primary-100 hover:text-primary-700 hover:font-semibold"
                onClick={() => {
                  navigator.clipboard.writeText(service.id);
                  toast.toast({
                    title: 'copied',
                  });
                }}
              >
                <Files className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-row gap-1">
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/billing`}
              >
                Gérer la facturation
              </OvhLink>
              <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
            </div>
            <div className="flex flex-row gap-1">
              <OvhLink application="dedicated" path={`#/support/tickets/new`}>
                Contacter le support
              </OvhLink>
              <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="col-start-1">
          <CardHeader></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li className="list-item">Cluster info</li>
              <li className="list-item">Connection info</li>
              <li className="list-item">Integrations</li>
              <li className="list-item">Relevant metrics ?</li>
              <li className="list-item">
                Starting steps (service ready / add ip / add users)
              </li>
              <li className="list-item">Guides</li>
              <li className="list-item">Support ?</li>
              <li className="list-item">Billing ?</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader></CardHeader>
          <CardContent>
            <ScrollArea className="p-2 h-[500px] bg-[#122844] text-white whitespace-pre">
              {JSON.stringify(service, null, 2)}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
