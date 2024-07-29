import { Info } from '@/types/cloud/project/ai/Info';
import { Progress } from '@/types/cloud/project/ai/volume/Progress';
import { DataSyncStateEnum } from '@/types/cloud/project/ai/volume/DataSyncStateEnum';

/** AI Solutions Data Sync Status */
export interface DataSyncStatus {
  /** Date when the data sync ended */
  endedAt?: string;
  /** Information about the data sync */
  info?: Info;
  /** Progress status of the data sync */
  progress?: Progress[];
  /** Date when the data sync was queued */
  queuedAt?: string;
  /** Date when the data sync was started */
  startedAt?: string;
  /** State of the data sync */
  state?: DataSyncStateEnum;
}
