/** KafkaConnect connector definition */
export interface ConnectorCreation {
  /** Configuration of the connector */
  configuration: { [key: string]: string };
  /** Connector capability ID */
  connectorId: string;
  /** Name of the connector */
  name: string;
}
