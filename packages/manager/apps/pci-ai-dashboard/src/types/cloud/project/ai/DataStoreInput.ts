import { DataStoreCredentialsInput } from '@/types/cloud/project/ai/DataStoreCredentialsInput';
import { DataStoreOwnerEnum } from '@/types/cloud/project/ai/DataStoreOwnerEnum';
import { DataStoreTypeEnum } from '@/types/cloud/project/ai/DataStoreTypeEnum';

/** AI Solutions data store container Volume Object */
export interface DataStoreInput {
  /** Data store alias */
  alias: string;
  /** Data store credentials */
  credentials: DataStoreCredentialsInput;
  /** Datastore endpoint */
  endpoint: string;
  /** Data store owner */
  owner: DataStoreOwnerEnum;
  /** Data store prefix */
  prefix?: string;
  /** Data store type */
  type: DataStoreTypeEnum;
}
