import { ResourcesInput } from '@/types/cloud/project/ai/ResourcesInput';
import { Volume } from '@/types/cloud/project/ai/volume/Volume';

/** AI Solutions Notebook Spec Object to update a notebook */
export interface NotebookUpdate {
  /** Labels for the notebook */
  labels: { [key: string]: string };
  /** Notebook resources */
  resources: ResourcesInput;
  /** SSH keys authorized to access the notebook */
  sshPublicKeys: string[];
  /** Whether notebook is set to be restarted after timeout */
  timeoutAutoRestart: boolean;
  /** Whether notebook api port can be accessed without any authentication token */
  unsecureHttp: boolean;
  /** Notebook Data linked */
  volumes: Volume[];
}
