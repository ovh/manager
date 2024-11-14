import { RetrievalStateEnum } from '@/types/cloud/storage/RetrievalStateEnum';

/** ContainerObject */
export interface ContainerObject {
  /** Object content type */
  contentType?: string;
  /** Last modification date */
  lastModified?: string;
  /** Object name */
  name?: string;
  /** Object retrieval delay (when unsealing) */
  retrievalDelay?: number;
  /** Object retrieval state */
  retrievalState?: RetrievalStateEnum;
  /** Object size */
  size?: number;
}
