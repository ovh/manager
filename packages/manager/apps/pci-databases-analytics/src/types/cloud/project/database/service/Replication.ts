import { PolicyClassEnum } from '@/types/cloud/project/database/service/replication/PolicyClassEnum';

/** Cloud database service replication definition */
export interface Replication {
  /** Defines whether heartbeats are emitted */
  emitHeartbeats: boolean;
  /** Defines whether the replication is actived */
  enabled: boolean;
  /** Service ID */
  id?: string;
  /** ReplicationPolicyClass used for the replication */
  replicationPolicyClass: PolicyClassEnum;
  /** ID of the integration source */
  sourceIntegration?: string;
  /** Defines whether the group offsets must be sync */
  syncGroupOffsets: boolean;
  /** Defines the interval in second between 2 sync */
  syncInterval: number;
  /** ID of the integration target */
  targetIntegration?: string;
  /** Patterns of the topics to exclude from the replication */
  topicExcludeList: string[];
  /** Patterns of the topics to replicate */
  topics: string[];
}
