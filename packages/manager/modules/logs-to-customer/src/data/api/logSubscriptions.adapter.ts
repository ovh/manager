import { LogSubscription, LogSubscriptionResponse } from '../types/dbaas/logs';
import {
  deleteLogSubscriptionV2,
  deleteLogSubscriptionV6,
  getLogSubscriptionsv2,
  getLogSubscriptionsv6,
  postLogSubscriptionV2,
  postLogSubscriptionV6,
} from './logSubscriptions';
import {
  GetSubscriptionsProps,
  PostSubscriptionProps,
  DeleteSubscriptionProps,
} from './logSubscriptions.props';

const isApiV2 = (apiVersion: string) => apiVersion === 'v2';

export const getLogSubscriptions = async ({
  apiVersion,
  logSubscriptionUrl,
  logKind,
}: GetSubscriptionsProps): Promise<LogSubscription[]> =>
  isApiV2(apiVersion)
    ? getLogSubscriptionsv2(logSubscriptionUrl, logKind)
    : getLogSubscriptionsv6(logSubscriptionUrl, logKind);

export const postLogSubscription = async ({
  apiVersion,
  logSubscriptionUrl,
  logKind,
  streamId,
}: PostSubscriptionProps): Promise<LogSubscriptionResponse> =>
  isApiV2(apiVersion)
    ? postLogSubscriptionV2(logSubscriptionUrl, logKind, streamId)
    : postLogSubscriptionV6(logSubscriptionUrl, logKind, streamId);

export const deleteLogSubscription = async ({
  apiVersion,
  logSubscriptionUrl,
  subscriptionId,
}: DeleteSubscriptionProps): Promise<LogSubscriptionResponse> =>
  isApiV2(apiVersion)
    ? deleteLogSubscriptionV2(logSubscriptionUrl, subscriptionId)
    : deleteLogSubscriptionV6(logSubscriptionUrl, subscriptionId);
