import { User } from '@/types/terraform/cloud/database/opensearch/User';
import { PathParams } from '@/types/terraform/cloud/database/PathParams';

/** Cloud databases request for Opensearch user terraform block */
export interface UserRequest {
  /** Opensearch user body */
  body: User;
  /** Opensearch user path parameters */
  pathParams: PathParams;
}
