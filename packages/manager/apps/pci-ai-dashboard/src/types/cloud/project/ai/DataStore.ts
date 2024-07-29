import { DataStoreOwnerEnum } from '@/types/cloud/project/ai/DataStoreOwnerEnum';
import { DataStoreTypeEnum } from '@/types/cloud/project/ai/DataStoreTypeEnum';

/** AI Solutions data store container Volume Object */
export interface DataStore {
  /** Data store alias */
  alias?: string;
  /** Data store endpoint URL */
  endpoint?: string;
  /** Owner type of the datastore */
  owner?: DataStoreOwnerEnum;
  /** Type of the datastore */
  type?: DataStoreTypeEnum;
}
