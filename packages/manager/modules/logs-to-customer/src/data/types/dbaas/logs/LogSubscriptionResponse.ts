/** Asynchronous operation after subscribing or unsubscribing to a resource logs */
export interface LogSubscriptionResponse {
  /** Identifier of the operation */
  operationId: string;
  /** Operation owner's service name */
  serviceName: string;
}
