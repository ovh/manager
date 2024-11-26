import { LogSubscriptionResource } from './LogSubscriptionResource';

/** Log subscription */
export interface LogSubscription {
  /** Creation date of the subscription */
  createdAt: string;
  /** Log kind name of this subscription */
  kind: string;
  /** Subscribed resource, where the logs come from */
  resource: LogSubscriptionResource;
  /** Name of the destination log service */
  serviceName: string;
  /** Id of the destination log stream */
  streamId: string;
  /** Subscription ID */
  subscriptionId: string;
  /** Last update date of the subscription */
  updatedAt: string;
}
