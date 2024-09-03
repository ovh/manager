import { DeploymentStrategy } from '@/types/cloud/project/ai/app/DeploymentStrategy';
import { Env } from '@/types/cloud/project/ai/Env';

/** AI Solutions AI App update object */
export interface UpdateInput {
  /** App command and arguments */
  command: string[];
  /** Number of CPU resources requested (applies to CPU flavors) */
  cpu: number;
  /** Default port to access http service inside the app */
  defaultHttpPort: number;
  /** Deployment strategy to use when updating this AI App */
  deploymentStrategy: DeploymentStrategy;
  /** Environment variables to be patched (empty/null value to remove) */
  envVars: Env[];
  /** App instance flavor */
  flavor: string;
  /** Number of GPU resources requested (applies to GPU flavors) */
  gpu: number;
  /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
  grpcPort: number;
  /** URL of the Docker image for this AI deployment */
  url: string;
}
