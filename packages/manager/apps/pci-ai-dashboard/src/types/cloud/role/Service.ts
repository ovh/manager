import { Permission } from '@/types/cloud/role/Permission';

/** OpenStack service */
export interface Service {
  /** Name of the service */
  name?: string;
  /** List of permissions */
  permissions?: Permission[];
}
