import { UserAcl } from '@/types/terraform/cloud/database/opensearch/UserAcl';

/** Opensearch user definition */
export interface User {
  /** Acls of the user. */
  acls: UserAcl[];
  /** Name of the user. */
  name: string;
}
