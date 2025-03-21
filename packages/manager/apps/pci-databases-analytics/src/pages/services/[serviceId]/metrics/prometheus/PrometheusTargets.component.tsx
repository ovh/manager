import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
} from '@datatr-ux/uxlib';
import { PrometheusData } from '@/data/api/database/prometheus.api';
import * as database from '@/types/cloud/project/database';
import PrometheusTableRow from './PrometheusTableRow.component';

interface PrometheusTargetsProps {
  prometheusData: PrometheusData;
}
const PrometheusTargets = ({ prometheusData }: PrometheusTargetsProps) => {
  const [selectedHost, setSelectedHost] = useState('');
  const promData = prometheusData as database.service.PrometheusEndpoint;
  useEffect(() => {
    if (selectedHost === '' && promData && 'targets' in promData)
      setSelectedHost(promData.targets[0].host);
  }, [promData]);
  const target = promData?.targets.find((ta) => ta.host === selectedHost);

  return (
    <div className="w-full">
      {promData.targets.length > 1 && (
        <Select value={selectedHost} onValueChange={(v) => setSelectedHost(v)}>
          <SelectTrigger
            data-testid="prometheus-target-selector"
            className="h-8 mb-3"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {promData.targets.map((ep) => (
              <SelectItem key={ep.host} value={ep.host}>
                {ep.host}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Table data-testid="prometheus-data-table">
        <TableBody>
          <PrometheusTableRow name="username" value={promData.username} />
          <PrometheusTableRow name="host" value={target?.host} />
          <PrometheusTableRow name="port" value={target?.port.toString()} />
        </TableBody>
      </Table>
    </div>
  );
};

export default PrometheusTargets;
