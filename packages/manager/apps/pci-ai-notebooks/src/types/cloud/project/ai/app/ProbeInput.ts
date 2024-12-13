/** AI Solutions App Probe Object */
export interface ProbeInput {
  /** Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. */
  failureThreshold?: number;
  /** Number of seconds after the container has started before liveness probes are initiated. */
  initialDelaySeconds?: number;
  /** Path to access to check for readiness */
  path?: string;
  /** How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. */
  periodSeconds?: number;
  /** Port to access to check for readiness */
  port?: number;
  /** Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1. */
  successThreshold?: number;
  /** Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. */
  timeoutSeconds?: number;
}
