import { JobEnv } from '@/types/cloud/project/ai/job/JobEnv';
import { Resources } from '@/types/cloud/project/ai/Resources';
import { ShutdownStrategyEnum } from '@/types/cloud/project/ai/ShutdownStrategyEnum';
import { Volume } from '@/types/cloud/project/ai/volume/Volume';

/** AI Solutions Job Spec Object to create a job */
export interface JobSpec {
  /** Job command */
  command?: string[];
  /** Port use as the default one to access http service inside job */
  defaultHttpPort?: number;
  /** List of environment variable to be set inside job */
  envVars?: JobEnv[];
  /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
  grpcPort?: number;
  /** Job image */
  image: string;
  /** Labels for the job */
  labels?: { [key: string]: string };
  /** Job name */
  name: string;
  /** Partner ID */
  partnerId?: string;
  /** User ID to use to access the job */
  readUser?: string;
  /** Host region of the job */
  region: string;
  /** Job resources */
  resources: Resources;
  /** Shutdown strategy (if any) */
  shutdown?: ShutdownStrategyEnum;
  /** SSH keys authorized to access to the job container */
  sshPublicKeys?: string[];
  /** Maximum time to spend before killing the job */
  timeout?: number;
  /** Whether job should be restarted after timeout */
  timeoutAutoRestart?: boolean;
  /** Whether job api port can be accessed without any authentication token */
  unsecureHttp?: boolean;
  /** Job Data linked */
  volumes?: Volume[];
}
