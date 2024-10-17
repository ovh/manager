import { DataSync } from '@/types/cloud/project/ai/volume/DataSync';
import { Info } from '@/types/cloud/project/ai/Info';
import { JobStatus } from '@/types/cloud/project/ai/job/JobStatus';
import { NotebookStateEnum } from '@/types/cloud/project/ai/notebook/NotebookStateEnum';
import { VolumeStatus } from '@/types/cloud/project/ai/volume/VolumeStatus';
import { NotebookWorkspace } from '@/types/cloud/project/ai/notebook/NotebookWorkspace';

/** AI Solutions Notebook Status Object */
export interface NotebookStatus {
  /** Status about the datasync linked to the job */
  dataSync?: DataSync[];
  /** Duration of the notebook in seconds */
  duration?: number;
  /** Address to reach when you want to access the Notebook's gRPC services */
  grpcAddress?: string;
  /** Information about the notebook */
  info?: Info;
  /** Notebook info url */
  infoUrl?: string;
  /** Status for the last job run */
  lastJobStatus?: JobStatus;
  /** Date when the notebook was last started */
  lastStartedAt?: string;
  /** Date when the notebook was last stopped */
  lastStoppedAt?: string;
  /** Notebook resource usage url */
  monitoringUrl?: string;
  /** SSH Url for the notebook */
  sshUrl?: string;
  /** State of the notebook */
  state?: NotebookStateEnum;
  /** Notebook access url */
  url?: string;
  /** Notebook Data linked */
  volumes?: VolumeStatus[];
  /** State of the notebook workspace */
  workspace?: NotebookWorkspace;
}
