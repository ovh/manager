import { useEffect, useState } from 'react';
import {
  Clipboard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { PrometheusData } from '@/data/api/database/prometheus.api';
import * as database from '@/types/cloud/project/database';

interface PrometheusTargetsProps {
  prometheusData: PrometheusData;
}
const PrometheusTargets = ({ prometheusData }: PrometheusTargetsProps) => {
  const [selectedHost, setSelectedHost] = useState('');
  const promData = prometheusData as database.service.PrometheusEndpoint;
  useEffect(() => {
    if (selectedHost === '' && promData && 'targets' in promData)
      setSelectedHost(promData.targets[0]?.host);
  }, [promData]);
  const target =
    promData?.targets.find((ta) => ta.host === selectedHost) ||
    promData?.targets[0];

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
      <div data-testid="prometheus-data-table" className="space-y-2 mb-4">
        <div>
          <p className="font-semibold capitalize">username</p>
          <Clipboard value={`${promData.username}`} />
        </div>
        <div>
          <p className="font-semibold capitalize">host</p>
          <Clipboard value={`${target?.host}`} />
        </div>
        <div>
          <p className="font-semibold capitalize">port</p>
          <Clipboard value={`${target?.port.toString()}`} />
        </div>
      </div>
    </div>
  );
};

export default PrometheusTargets;
