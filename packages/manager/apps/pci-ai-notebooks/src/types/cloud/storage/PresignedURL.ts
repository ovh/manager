import { PresignedURLMethodEnum } from '@/types/cloud/storage/PresignedURLMethodEnum';

/** Presigned URL */
export interface PresignedURL {
  /** Presigned URL method */
  method?: PresignedURLMethodEnum;
  /** Signed headers */
  signedHeaders?: { [key: string]: string };
  /** Presigned URL */
  url?: string;
}
