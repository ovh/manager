import { NotebookEnv } from '@/types/cloud/project/ai/notebook/NotebookEnv';
import { JobEnv } from '@/types/cloud/project/ai/job/JobEnv';
import { ResourcesInput } from '@/types/cloud/project/ai/ResourcesInput';
import { ShutdownStrategyEnum } from '@/types/cloud/project/ai/ShutdownStrategyEnum';
import { Volume } from '@/types/cloud/project/ai/volume/Volume';

/** AI Solutions Notebook Spec Object to create a notebook */
export interface NotebookSpecInput {
  /** Environment to deploy in this notebook */
  env: NotebookEnv;
  /** List of environment variables to be set inside the notebook */
  envVars: JobEnv[];
  /** Labels are used to scope tokens, labels prefixed by 'ovh/' are owned by the platform and overridden */
  labels: { [key: string]: string };
  /** Notebook name */
  name: string;
  /** Host region of the notebook */
  region: string;
  /** Notebook resources */
  resources: ResourcesInput;
  /** Shutdown strategy (if any) */
  shutdown?: ShutdownStrategyEnum;
  /** SSH keys authorized to access the notebook */
  sshPublicKeys: string[];
  /** Whether notebook is set to be restarted after timeout */
  timeoutAutoRestart: boolean;
  /** Whether notebook api port can be accessed without any authentication token */
  unsecureHttp: boolean;
  /** Notebook Data linked */
  volumes: Volume[];
}
