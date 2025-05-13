/** Log subscription creation payload */
export interface LogSubscriptionCreation {
  /** Log kind name to subscribe to */
  kind: string;
  /** Customer log stream ID */
  streamId: string;
}
