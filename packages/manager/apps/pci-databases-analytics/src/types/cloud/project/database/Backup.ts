import { Region } from '@/types/cloud/project/database/backup/Region';
import { UnitAndValueLong } from '@/types/complexType/UnitAndValueLong';
import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';
import { BackupTypeEnum } from '@/types/cloud/project/database/BackupTypeEnum';

/** Cloud database backup definition */
export interface Backup {
  /** Date of the creation of the backup */
  createdAt?: string;
  /** Description of the backup */
  description: string;
  /** Backup ID */
  id?: string;
  /** Region where the backup is stored. DEPRECATED: use regions */
  region?: string;
  /** Regions where the backup are stored */
  regions?: Region[];
  /** Size of the backup */
  size?: UnitAndValueLong;
  /** Current status of the backup */
  status?: StatusEnum;
  /** Type of backup */
  type?: BackupTypeEnum;
}
