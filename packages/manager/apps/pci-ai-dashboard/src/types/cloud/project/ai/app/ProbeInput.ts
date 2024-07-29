/** AI Solutions App Probe Object */
export interface ProbeInput {
  /** Path to access to check for readiness */
  path: string;
  /** Port to access to check for readiness */
  port: number;
}
