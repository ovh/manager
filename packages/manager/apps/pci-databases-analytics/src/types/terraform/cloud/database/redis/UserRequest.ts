import { PathParams } from '@/types/terraform/cloud/database/PathParams';
import { User } from '@/types/terraform/cloud/database/redis/User';

/** Cloud databases request for Redis user terraform block */
export interface UserRequest {
  /** Redis user body */
  body: User;
  /** Redis user path parameters */
  pathParams: PathParams;
}
