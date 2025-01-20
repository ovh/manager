import { Target } from '@/types/cloud/project/database/service/prometheus/Target';

/** Prometheus Endpoint */
export interface PrometheusEndpoint {
  /** Endpoint target for Prometheus */
  targets: Target[];
  /** Name of the Prometheus access */
  username: string;
}
