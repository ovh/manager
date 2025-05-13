import { UserAcl } from '@/types/cloud/project/database/opensearch/UserAcl';

/** Opensearch user creation definition */
export interface UserCreation {
  /** Acls of the user */
  acls: UserAcl[];
  /** Name of the user */
  name: string;
}
