import { Handler } from '@ovh-ux/manager-core-test-utils';
import { apiUrlMocks } from '../../test-utils/test.constant';
import { logSubscriptionsMock } from './logSubscription.mock';

export type GetLogSubscriptionsMocksParams = {
  baseUrl?: string;
  isLogSubscriptionKO?: boolean;
  nbLogSubscription?: number;
};

export const LogSubscriptionsError = 'log subscription error';

export const getLogSubscriptionsMocks = ({
  isLogSubscriptionKO,
  nbLogSubscription = logSubscriptionsMock.length,
}: GetLogSubscriptionsMocksParams): Handler[] => [
  {
    url: apiUrlMocks.logSubscription,
    response: isLogSubscriptionKO
      ? { message: LogSubscriptionsError }
      : logSubscriptionsMock.slice(0, nbLogSubscription),
    status: isLogSubscriptionKO ? 500 : 200,
    api: 'v2',
  },
];
