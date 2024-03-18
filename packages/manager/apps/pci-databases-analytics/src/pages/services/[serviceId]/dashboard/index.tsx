import { H2 } from '@/components/typography';
import { useServiceData } from '../layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import MetricChart from '../metrics/_components/metricChart';
import { database } from '@/models/database';
import { POLLING } from '@/configuration/polling';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Dashboard = () => {
  const { service } = useServiceData();
  return (
    <>
      <H2>dashboard</H2>

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
      </div>
    </>
  );
};

export default Dashboard;
