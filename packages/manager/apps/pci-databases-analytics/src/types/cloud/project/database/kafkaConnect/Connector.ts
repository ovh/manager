import { StatusEnum } from '@/types/cloud/project/database/kafkaConnect/connector/StatusEnum';

/** KafkaConnect connector definition */
export interface Connector {
  /** Configuration of the connector */
  configuration: { [key: string]: string };
  /** Connector capability ID */
  connectorId?: string;
  /** Connector ID */
  id?: string;
  /** Name of the connector */
  name?: string;
  /** Status of the connector */
  status?: StatusEnum;
}
