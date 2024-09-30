import { StatusEnum } from '@/types/cloud/project/database/kafkaConnect/connector/task/StatusEnum';

/** KafkaConnect connector definition */
export interface Task {
  /** Task ID */
  id?: number;
  /** Status of the task */
  status?: StatusEnum;
  /** Trace of the task */
  trace?: string;
}
