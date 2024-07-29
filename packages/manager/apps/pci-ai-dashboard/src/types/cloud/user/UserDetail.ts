import { Role } from '@/types/cloud/role/Role';
import { UserStatusEnum } from '@/types/cloud/user/UserStatusEnum';

/** UserDetail */
export interface UserDetail {
  /** User creation date */
  creationDate?: string;
  /** User description */
  description?: string;
  /** User id */
  id?: number;
  /** User id on openstack */
  openstackId?: string;
  /** User password */
  password?: string;
  /** User roles */
  roles?: Role[];
  /** User status */
  status?: UserStatusEnum;
  /** Username */
  username?: string;
}
