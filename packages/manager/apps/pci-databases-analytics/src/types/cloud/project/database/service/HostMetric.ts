import { DataPoint } from '@/types/cloud/project/database/service/DataPoint';

/** Metrics datapoints from a specific host */
export interface HostMetric {
  /** List of metric's samples */
  dataPoints?: DataPoint[];
  /** Name of the originating host */
  hostname?: string;
}
