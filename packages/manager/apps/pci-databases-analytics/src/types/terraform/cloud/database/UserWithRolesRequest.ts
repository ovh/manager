import { PathParams } from '@/types/terraform/cloud/database/PathParams';
import { UserWithRoles } from '@/types/terraform/cloud/database/UserWithRoles';

/** Cloud databases request for user with roles terraform block */
export interface UserWithRolesRequest {
  /** User with roles body */
  body: UserWithRoles;
  /** User with roles path parameters */
  pathParams: PathParams;
}
