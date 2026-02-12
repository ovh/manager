import { logSubscriptionsMock } from '@/__mocks__/logSubscription.mock';
import { LogSubscription } from '@/data/types/dbaas/logs/Logs.type';
import getStreamSubscription from '@/helpers/getStreamSubscription';

describe('getStreamSubscription test', () => {
  type TTestCases = {
    subscriptions: LogSubscription[];
    streamId: string;
    result: LogSubscription | undefined;
  };

  const testcases: TTestCases[] = [
    {
      subscriptions: logSubscriptionsMock,
      streamId: logSubscriptionsMock?.[0]?.streamId ?? '',
      result: logSubscriptionsMock[0],
    },
    {
      subscriptions: logSubscriptionsMock,
      streamId: 'another id',
      result: undefined,
    },
  ];

  it.each(testcases)('should return $result', ({ subscriptions, streamId, result }) => {
    expect(getStreamSubscription(subscriptions, streamId)).toEqual(result);
  });
});
