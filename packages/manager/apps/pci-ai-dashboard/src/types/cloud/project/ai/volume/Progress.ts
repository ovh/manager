import { DataSyncEnum } from '@/types/cloud/project/ai/volume/DataSyncEnum';
import { DataSyncProgressStateEnum } from '@/types/cloud/project/ai/volume/DataSyncProgressStateEnum';

/** AI Solutions Progress Object */
export interface Progress {
  /** Number of completed files */
  completed?: number;
  /** Progress creation date */
  createdAt?: string;
  /** Number of deleted files */
  deleted?: number;
  /** Direction of the progress sync */
  direction?: DataSyncEnum;
  /** ETA to finish in seconds. Deprecated */
  eta?: number;
  /** Number of failed files */
  failed?: number;
  /** Progress Id */
  id?: string;
  /** Volume information */
  info?: string;
  /** Number of processed files */
  processed?: number;
  /** Number of skipped files */
  skipped?: number;
  /** State of the progress sync */
  state?: DataSyncProgressStateEnum;
  /** Total number of files */
  total?: number;
  /** Transferred size in bytes */
  transferredBytes?: number;
  /** Progress update date */
  updatedAt?: string;
}
