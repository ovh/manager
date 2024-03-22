import {
  ArrowRight,
  Files,
  Globe2,
  TrafficCone,
  UserCheck,
} from 'lucide-react';
import { useParams } from 'react-router';
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

const Dashboard = () => {
  const { service } = useServiceData();
  const { projectId } = useParams();
  const toast = useToast();
  return (
    <>
      <h2>dashboard</h2>

      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <MetricChart
              metric={'disk_usage_percent'}
              period={database.service.MetricPeriodEnum.lastDay}
              poll={false}
              pollInterval={POLLING.METRICS}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <MetricChart
              metric={'cpu_usage_percent'}
              period={database.service.MetricPeriodEnum.lastDay}
              poll={false}
              pollInterval={POLLING.METRICS}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <MetricChart
              metric={
                service.engine === database.EngineEnum.mongodb
                  ? 'mem_usage'
                  : 'mem_usage_percent'
              }
              period={database.service.MetricPeriodEnum.lastDay}
              poll={false}
              pollInterval={POLLING.METRICS}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {service.endpoints.length > 0 && (
          <div className="flex flex-row items-start gap-5">
            <Globe2 className="h-4 w-4 mt-1" />
            <div className="flex h-full max-w-content flex-col gap-3">
              <h5>Informations de connection</h5>
              <ConnectionDetails endpoints={service.endpoints} />
            </div>
          </div>
        )}
        <div className="flex flex-row items-start gap-5">
          <TrafficCone className="h-4 w-4 mt-1 text-amber-600" />
          <div className="flex h-full max-w-content flex-col gap-3">
            <h5>Maintenance</h5>
            <Maintenance />
          </div>
        </div>
        <div className="flex flex-row items-start gap-5">
          <UserCheck className="h-4 w-4 mt-1" />
          <div className="flex h-full max-w-content flex-col gap-3">
            <h5>Support & Billing</h5>
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
          </div>
        </div>
      </div>
      <Card>
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
    </>
  );
};

export default Dashboard;
