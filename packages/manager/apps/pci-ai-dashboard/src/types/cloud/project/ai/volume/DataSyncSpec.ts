import { DataSyncEnum } from '@/types/cloud/project/ai/volume/DataSyncEnum';

/** AI Solutions Data Sync Spec */
export interface DataSyncSpec {
  /** Direction of the sync */
  direction: DataSyncEnum;
  /** True if the user has created the object */
  manual?: boolean;
  /** Only sync this volume */
  volume: string;
}
