import { RetentionTypeEnum } from './RetentionTypeEnum';

/** Cluster retention */
export interface ClusterRetention {
  /** Indexed duration expressed in ISO-8601 format */
  duration?: string;
  /** Indicates if a new stream can use it */
  isSupported: boolean;
  /** Retention ID */
  retentionId: string;
  /** Retention type */
  retentionType: RetentionTypeEnum;
}
