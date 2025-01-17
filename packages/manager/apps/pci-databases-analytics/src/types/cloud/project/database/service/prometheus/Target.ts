/** Prometheus endpoint target */
export interface Target {
  /** Hostname of the prometheus target */
  host: string;
  /** Port of the prometheus target */
  port: number;
}
