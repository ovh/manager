import { LogSubscription, LogSubscriptionResource } from '../types/dbaas/logs';

export const logSubscriptionsMock: LogSubscription[] = [
  {
    serviceName: 'SubscriptionMock',
    createdAt: '2024-10-23T15:24:23Z',
    kind: 'kind-name',
    updatedAt: '2024-10-23T15:24:23Z',
    subscriptionId: 'B5F995F2-BE9C-4805-8910-9A4E5DD25EBF',
    streamId: 'F995F2-BE9C-4805-8910-9A4E',
    resource: { name: 'audit-rest', type: '' } as LogSubscriptionResource,
  },
  {
    serviceName: 'SubscriptionMock2',
    createdAt: '2024-10-23T15:24:23Z',
    kind: 'kind-name',
    updatedAt: '2024-10-23T15:24:23Z',
    subscriptionId: 'B5F995F2-BE9C-4805-8910-9A4E5BF',
    streamId: 'F995F2-BE9C-4805-8910-9A4E',
    resource: { name: 'audit-rest', type: '' } as LogSubscriptionResource,
  },
];
