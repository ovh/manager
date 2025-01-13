import { PolicyRoleEnum } from '@/types/cloud/storage/PolicyRoleEnum';

/** Add storage policy for container */
export interface AddContainerPolicy {
  /** Container object key */
  objectKey: string;
  /** Policy role */
  roleName: PolicyRoleEnum;
}
