import { LogKind } from '@/data/types/dbaas/logs/Logs.type';

export interface GetSubscriptionsProps {
  apiVersion: string;
  logSubscriptionUrl: string;
  logKind?: LogKind;
}

export interface PostSubscriptionProps {
  apiVersion: string;
  logSubscriptionUrl: string;
  logKind?: LogKind;
  streamId?: string;
}

export interface DeleteSubscriptionProps {
  apiVersion: string;
  logSubscriptionUrl: string;
  subscriptionId: string;
}
