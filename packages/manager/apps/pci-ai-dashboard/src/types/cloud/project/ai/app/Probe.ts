/** AI Solutions App Probe Object */
export interface Probe {
  /** Path to access to check for readiness */
  path?: string;
  /** Port to access to check for readiness */
  port?: number;
}
