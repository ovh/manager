import { HostMetric } from '@/types/cloud/project/database/service/HostMetric';
import { MetricUnitEnum } from '@/types/cloud/project/database/service/MetricUnitEnum';

/** Metric definition for cloud project databases */
export interface Metric {
  /** Metric values for each cluster's host */
  metrics?: HostMetric[];
  /** Name of the metric */
  name?: string;
  /** Unit of the metric */
  units?: MetricUnitEnum;
}
