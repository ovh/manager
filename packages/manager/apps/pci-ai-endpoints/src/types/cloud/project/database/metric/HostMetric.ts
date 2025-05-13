import { DataPoint } from '@/types/cloud/project/database/metric/DataPoint';

export interface HostMetric {
  data?: DataPoint[];
  unit?: string;
}
