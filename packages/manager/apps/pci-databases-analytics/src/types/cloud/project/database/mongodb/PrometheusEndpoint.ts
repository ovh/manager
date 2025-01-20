/** Prometheus Endpoint for MongoDB */
export interface PrometheusEndpoint {
  /** Prometheus SRV domain for mongodb cluster */
  srvDomain: string;
  /** Name of the Prometheus access */
  username: string;
}
