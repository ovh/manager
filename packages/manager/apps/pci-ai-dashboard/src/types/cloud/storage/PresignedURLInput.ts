import { PresignedURLMethodEnum } from '@/types/cloud/storage/PresignedURLMethodEnum';
import { StorageClassEnum } from '@/types/cloud/storage/StorageClassEnum';

/** Inputs to generate a presigned URL */
export interface PresignedURLInput {
  /** URL expiration in seconds */
  expire: number;
  /** Presigned URL method */
  method: PresignedURLMethodEnum;
  /** Object name */
  object: string;
  /** Storage class */
  storageClass: StorageClassEnum;
}
