import { DataSync } from '@/types/cloud/project/ai/volume/DataSync';
import { Ip } from '@/types/Ip';
import { JobStatusHistory } from '@/types/cloud/project/ai/job/JobStatusHistory';
import { Info } from '@/types/cloud/project/ai/Info';
import { JobStateEnum } from '@/types/cloud/project/ai/job/JobStateEnum';
import { VolumeStatus } from '@/types/cloud/project/ai/volume/VolumeStatus';

/** AI Solutions Job Status Object */
export interface JobStatus {
  /** Status about the datasync linked to the job */
  dataSync?: DataSync[];
  /** Duration of the job */
  duration?: number;
  /** Exit code of the job */
  exitCode?: number;
  /** External IP of the job */
  externalIp?: Ip;
  /** Date when the job was finalized */
  finalizedAt?: string;
  /** Address to reach when you want to access the Job's gRPC services */
  grpcAddress?: string;
  /** Job state history */
  history?: JobStatusHistory[];
  /** Information about the job */
  info?: Info;
  /** Job info url */
  infoUrl?: string;
  /** Date when the job was initialized */
  initializingAt?: string;
  /** IP of the job */
  ip?: Ip;
  /** Date of the last transition */
  lastTransitionDate?: string;
  /** Job resource usage url */
  monitoringUrl?: string;
  /** Date when the job was queued */
  queuedAt?: string;
  /** SSH Url fot the job */
  sshUrl?: string;
  /** Date when the job was started */
  startedAt?: string;
  /** State of the job */
  state?: JobStateEnum;
  /** Date when the job was stop */
  stoppedAt?: string;
  /** Date when the job is planned to timeout */
  timeoutAt?: string;
  /** Job access url */
  url?: string;
  /** Job Data linked */
  volumes?: VolumeStatus[];
}
