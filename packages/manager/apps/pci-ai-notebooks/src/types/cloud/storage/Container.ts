import { TypeEnum } from '@/types/cloud/storage/TypeEnum';

/** Container */
export interface Container {
  /** Whether this is an archive container or not */
  archive?: boolean;
  /** Container type */
  containerType?: TypeEnum;
  /** Storage id */
  id?: string;
  /** Storage name */
  name?: string;
  /**  */
  region?: string;
  /** Total bytes stored */
  storedBytes?: number;
  /** Total objects stored */
  storedObjects?: number;
}
