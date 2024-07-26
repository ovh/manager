import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';

/** User definition */
export interface User {
  /** Date of the creation of the user */
  createdAt?: string;
  /** User ID */
  id?: string;
  /** Current status of the user */
  status?: StatusEnum;
  /** Name of the user */
  username?: string;
}
