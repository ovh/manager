import { HostMetric } from '@/types/cloud/project/database/metric/HostMetric';

export interface MetricData {
  metrics?: HostMetric[];
  model?: string;
}
