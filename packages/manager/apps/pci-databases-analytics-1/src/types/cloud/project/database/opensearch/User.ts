import { UserAcl } from '@/types/cloud/project/database/opensearch/UserAcl';
import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';

/** Opensearch user definition */
export interface User {
  /** Acls of the user */
  acls: UserAcl[];
  /** Date of the creation of the user */
  createdAt?: string;
  /** User ID */
  id?: string;
  /** Current status of the user */
  status?: StatusEnum;
  /** Name of the user */
  username?: string;
}
