import { DeploymentStrategy } from '@/types/cloud/project/ai/app/DeploymentStrategy';
import { JobEnv } from '@/types/cloud/project/ai/job/JobEnv';
import { ProbeInput } from '@/types/cloud/project/ai/app/ProbeInput';
import { ResourcesInput } from '@/types/cloud/project/ai/ResourcesInput';
import { ScalingStrategyInput } from '@/types/cloud/project/ai/app/ScalingStrategyInput';
import { Volume } from '@/types/cloud/project/ai/volume/Volume';

/** AI Solutions App Spec Object to create a app */
export interface AppSpecInput {
  /** App command */
  command: string[];
  /** Default port to access http service inside the app */
  defaultHttpPort: number;
  /** AI App deployment strategy */
  deploymentStrategy: DeploymentStrategy;
  /** List of environment variable to be set inside the app */
  envVars: JobEnv[];
  /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
  grpcPort: number;
  /** Docker or capability image to use in the app. App capability images must comply with the pattern 'image-id:version' */
  image: string;
  /** Labels are used to scope tokens, labels prefixed by 'ovh/' are owned by the platform and overridden */
  labels: { [key: string]: string };
  /** App name */
  name: string;
  /** Partner ID */
  partnerId: string;
  /** App readiness probe */
  probe: ProbeInput;
  /** Host region of the app */
  region: string;
  /** App resources */
  resources: ResourcesInput;
  /** App scaling strategy */
  scalingStrategy: ScalingStrategyInput;
  /** Whether if app api port can be accessed without any authentication token */
  unsecureHttp: boolean;
  /** App Data linked */
  volumes: Volume[];
}
