import { ReplicationRuleStatusEnum } from '@/types/cloud/storage/ReplicationRuleStatusEnum';

/** Object Storage replication configuration rule */
export interface ReplicationRule {
  /** Rule ID */
  id: string;
  /** Rule status */
  status: ReplicationRuleStatusEnum;
}
