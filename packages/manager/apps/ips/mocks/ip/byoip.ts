import { Handler } from '@ovh-ux/manager-core-test-utils';

export type GetByoipMocksParams = {
  hasAggregates?: boolean;
  hasSlices?: boolean;
  isPostAggregateKo?: boolean;
  isPostSliceKo?: boolean;
};

export const getByoipMocks = ({
  hasAggregates = false,
  hasSlices = false,
  isPostAggregateKo = false,
  isPostSliceKo = false,
}: GetByoipMocksParams): Handler[] => [
  {
    url: '/ip/:ip/bringYourOwnIp/aggregate',
    response: hasAggregates
      ? [
          {
            aggregationIp: '1.1.1.1.0/24',
            childrenIps: ['1.1.1.1.0/32', '1.1.1.1.1/32'],
          },
        ]
      : [],
    api: 'v6',
  },
  {
    url: '/ip/:ip/bringYourOwnIp/aggregate',
    response: isPostAggregateKo
      ? { message: 'POST Aggregate KO' }
      : { taskId: '1234' },
    api: 'v6',
    method: 'post',
    status: isPostAggregateKo ? 400 : 200,
  },
  {
    url: '/ip/:ip/bringYourOwnIp/slice',
    response: hasSlices
      ? [{ slicingSize: 28, childrenIps: ['1.1.1.1.0/28', '1.1.1.1.1/28'] }]
      : [],
    api: 'v6',
  },
  {
    url: '/ip/:ip/bringYourOwnIp/slice',
    response: isPostSliceKo ? { message: 'POST Slice KO' } : { taskId: '1234' },
    api: 'v6',
    method: 'post',
    status: isPostSliceKo ? 400 : 200,
  },
];
