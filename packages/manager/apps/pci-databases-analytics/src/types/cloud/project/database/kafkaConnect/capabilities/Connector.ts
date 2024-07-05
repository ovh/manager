import { TypeEnum } from '@/types/cloud/project/database/kafkaConnect/capabilities/connector/TypeEnum';

/** KafkaConnect connector capability definition */
export interface Connector {
  /** Name of the connector's author */
  author?: string;
  /** URL of the official documentation of the connector */
  documentationUrl?: string;
  /** Connector ID */
  id?: string;
  /** Defines whether this connector and version is the latest available */
  latest?: boolean;
  /** Name of the connector */
  name?: string;
  /** Defines whether the connector is in preview */
  preview?: boolean;
  /** Type of connector */
  type?: TypeEnum;
  /** Version of the connector */
  version?: string;
}
