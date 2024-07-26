import { StatusEnum } from '@/types/cloud/project/database/service/maintenance/StatusEnum';

/** Cloud database service maintenance definition */
export interface Maintenance {
  /** Date of the application of the maintenance */
  appliedAt?: string;
  /** Description of the maintenance */
  description?: string;
  /** ID of the maintenance */
  id?: string;
  /** Date of the planification of the maintenance */
  scheduledAt?: string;
  /** Status of the maintenance */
  status?: StatusEnum;
}
