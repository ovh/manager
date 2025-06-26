import { PathParamsWithEngine } from '@/types/terraform/cloud/database/PathParamsWithEngine';
import { User } from '@/types/terraform/cloud/database/User';

/** Cloud databases request for user terraform block */
export interface UserRequest {
  /** User body */
  body: User;
  /** User path parameters */
  pathParams: PathParamsWithEngine;
}
