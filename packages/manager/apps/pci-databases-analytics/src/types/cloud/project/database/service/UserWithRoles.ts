import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';

/** User definition */
export interface UserWithRoles {
  /** Date of the creation of the user */
  createdAt?: string;
  /** User ID */
  id?: string;
  /** Roles the user belongs to */
  roles: string[];
  /** Current status of the user */
  status?: StatusEnum;
  /** Name of the user */
  username?: string;
}
