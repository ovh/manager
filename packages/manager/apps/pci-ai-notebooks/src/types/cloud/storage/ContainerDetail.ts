import { TypeEnum } from '@/types/cloud/storage/TypeEnum';
import { ContainerObject } from '@/types/cloud/storage/ContainerObject';

/** ContainerDetail */
export interface ContainerDetail {
  /** Whether this is an archive container or not */
  archive?: boolean;
  /** Container type */
  containerType?: TypeEnum;
  /** Origins allowed to make Cross Origin Requests */
  cors?: string[];
  /** Container name */
  name?: string;
  /** Objects stored in container */
  objects?: ContainerObject[];
  /** Public container (DEPRECATED: see containerType) */
  public?: boolean;
  /** Container region */
  region?: string;
  /** Container static URL */
  staticUrl?: string;
  /** Total bytes stored */
  storedBytes?: number;
  /** Total objects stored */
  storedObjects?: number;
}
