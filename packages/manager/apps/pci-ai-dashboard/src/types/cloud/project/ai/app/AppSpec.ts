import { DeploymentStrategy } from '@/types/cloud/project/ai/app/DeploymentStrategy';
import { JobEnv } from '@/types/cloud/project/ai/job/JobEnv';
import { Probe } from '@/types/cloud/project/ai/app/Probe';
import { Resources } from '@/types/cloud/project/ai/Resources';
import { ScalingStrategy } from '@/types/cloud/project/ai/app/ScalingStrategy';
import { Volume } from '@/types/cloud/project/ai/volume/Volume';

/** AI Solutions App Spec Object to create an app */
export interface AppSpec {
  /** App command */
  command?: string[];
  /** Default port to access the http service inside the app */
  defaultHttpPort?: number;
  /** AI App deployment strategy */
  deploymentStrategy?: DeploymentStrategy;
  /** List of environment variable to be set inside the app */
  envVars?: JobEnv[];
  /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
  grpcPort?: number;
  /** App image */
  image?: string;
  /** Labels for the app */
  labels?: { [key: string]: string };
  /** App name */
  name?: string;
  /** Partner ID */
  partnerId?: string;
  /** App readiness probe */
  probe?: Probe;
  /** Host region of the app */
  region?: string;
  /** App resources */
  resources?: Resources;
  /** App scaling strategy */
  scalingStrategy?: ScalingStrategy;
  /** True if app api port can be accessed without any authentication token, false otherwise */
  unsecureHttp?: boolean;
  /** App Data linked */
  volumes?: Volume[];
}
