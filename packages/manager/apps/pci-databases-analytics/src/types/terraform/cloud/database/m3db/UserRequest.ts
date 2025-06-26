import { User } from '@/types/terraform/cloud/database/m3db/User';
import { PathParams } from '@/types/terraform/cloud/database/PathParams';

/** Cloud databases request for M3DB user terraform block */
export interface UserRequest {
  /** M3db user body */
  body: User;
  /** M3db user path parameters */
  pathParams: PathParams;
}
