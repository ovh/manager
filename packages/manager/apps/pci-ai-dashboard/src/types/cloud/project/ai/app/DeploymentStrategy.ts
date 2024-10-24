/** AI Solutions AI App deployment strategy object */
export interface DeploymentStrategy {
  /** Maximum number of replicas that can be created over the desired number of Pods (can be expressed as a percentage of the desired pods, suffixed with '%') */
  maxSurge: string;
  /** Maximum number of replicas that can be unavailable during the update process (can be expressed as a percentage of the desired pods, suffixed with '%') */
  maxUnavailable: string;
  /** Number of seconds you want to wait for your Deployment to progress before the system reports back that the Deployment has failed progressing */
  progressDeadlineSeconds: number;
}
