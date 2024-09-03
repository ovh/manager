import { DataSyncSpec } from '@/types/cloud/project/ai/volume/DataSyncSpec';
import { DataSyncStatus } from '@/types/cloud/project/ai/volume/DataSyncStatus';

/** AI Solutions Data Sync */
export interface DataSync {
  /** Data Sync creation date */
  createdAt?: string;
  /** Data Sync Id */
  id?: string;
  /** Data Sync specifications */
  spec?: DataSyncSpec;
  /** Data Sync status */
  status?: DataSyncStatus;
  /** Data Sync update date */
  updatedAt?: string;
}
