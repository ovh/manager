import { Role } from '@/types/cloud/role/Role';
import { Service } from '@/types/cloud/role/Service';

/** OpenStack role */
export interface Roles {
  /** OpenStack roles */
  roles?: Role[];
  /** OpenStack services */
  services?: Service[];
}
